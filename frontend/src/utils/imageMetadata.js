export async function preserveMetadata(originalFile, compressedBlob) {
  // Only process JPEGs
  if (originalFile.type !== 'image/jpeg' || compressedBlob.type !== 'image/jpeg') {
    return compressedBlob;
  }

  try {
    const origBuffer = await originalFile.arrayBuffer();
    const newBuffer = await compressedBlob.arrayBuffer();
    
    const origView = new Uint8Array(origBuffer);
    const newView = new Uint8Array(newBuffer);
    
    // Check SOI
    if (origView[0] !== 0xFF || origView[1] !== 0xD8) return compressedBlob;
    if (newView[0] !== 0xFF || newView[1] !== 0xD8) return compressedBlob;

    // Extract APP1-APP15 from original
    const markers = [];
    let offset = 2;
    while (offset < origView.length) {
      if (origView[offset] !== 0xFF) break;
      const marker = origView[offset + 1];
      if (marker === 0xDA || marker === 0xD9) break; // SOS or EOI
      
      const length = (origView[offset + 2] << 8) | origView[offset + 3];
      
      // Copy APP1 (0xE1) to APP15 (0xEF)
      if (marker >= 0xE1 && marker <= 0xEF) {
        markers.push(origView.slice(offset, offset + 2 + length));
      }
      offset += 2 + length;
    }

    if (markers.length === 0) return compressedBlob;

    // Find insertion point in new JPEG
    let insertOffset = 2;
    if (newView[2] === 0xFF && newView[3] === 0xE0) {
      const app0Length = (newView[4] << 8) | newView[5];
      insertOffset += 2 + app0Length;
    }

    // Splice
    const before = newView.slice(0, insertOffset);
    const after = newView.slice(insertOffset);
    
    // Calculate total length
    let totalLength = before.length + after.length;
    for (const m of markers) totalLength += m.length;
    
    const finalBuffer = new Uint8Array(totalLength);
    finalBuffer.set(before, 0);
    
    let currentOffset = before.length;
    for (const m of markers) {
      finalBuffer.set(m, currentOffset);
      currentOffset += m.length;
    }
    
    finalBuffer.set(after, currentOffset);
    
    return new Blob([finalBuffer], { type: 'image/jpeg' });
  } catch (err) {
    console.error("Metadata preservation failed:", err);
    return compressedBlob; // Fallback to safely return the stripped compressed image
  }
}
