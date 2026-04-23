export const emitGlobal = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};
