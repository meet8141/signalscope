const fs = require('fs');

function extractMetadataMarkers(buffer) {
    const markers = [];
    let offset = 2; // skip FF D8
    while (offset < buffer.length) {
        if (buffer[offset] !== 0xFF) break;
        const marker = buffer[offset + 1];
        if (marker === 0xDA || marker === 0xD9) break; // SOS or EOI
        
        const length = (buffer[offset + 2] << 8) | buffer[offset + 3];
        // We want APP1 (0xE1) through APP15 (0xEF), excluding APP0 (0xE0) which is JFIF
        if (marker >= 0xE1 && marker <= 0xEF) {
            markers.push(buffer.slice(offset, offset + 2 + length));
        }
        offset += 2 + length;
    }
    return markers;
}

function injectMetadata(originalBuffer, newBuffer) {
    const markers = extractMetadataMarkers(originalBuffer);
    if (markers.length === 0) return newBuffer;

    // Find insertion point in new buffer (after FF D8 and optional APP0)
    let insertOffset = 2;
    if (newBuffer[2] === 0xFF && newBuffer[3] === 0xE0) {
        const app0Length = (newBuffer[4] << 8) | newBuffer[5];
        insertOffset += 2 + app0Length;
    }

    const before = newBuffer.slice(0, insertOffset);
    const after = newBuffer.slice(insertOffset);
    
    return Buffer.concat([before, ...markers, after]);
}

console.log("Metadata splicer ready.");
