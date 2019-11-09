function isStream(stream: any): boolean {
  return stream !== null &&
    typeof stream === "object" &&
    typeof stream.pipe === "function";
}

function isWriteStream(stream: any): boolean {
  return isStream(stream) &&
    stream.writable !== false &&
    typeof stream._write === "function" &&
    typeof stream._writableState === "object";
}

function isReadStream(stream: any): boolean {
  return isStream(stream) &&
    stream.readable !== false &&
    typeof stream._read === "function" &&
    typeof stream._readableState === "object";
}

function isDuplexStream(stream: any): boolean {
  return isWriteStream(stream) &&
    isReadStream(stream);
}

export {
  isStream,
  isReadStream,
  isWriteStream,
  isDuplexStream,
};
