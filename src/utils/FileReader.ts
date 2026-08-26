const makeStringFileReader = function() {
    const reader = new FileReader();
    const promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
    });
    return {reader, promise};
};
const makeBufferFileReader = function() {
    const reader = new FileReader();
    const promise = new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
    });
    return {reader, promise};
};

export const readAsArrayBuffer = (file: Blob) => {
    const {reader, promise} = makeBufferFileReader();
    reader.readAsArrayBuffer(file);
    return promise;
};

export const readAsText = (file: Blob) => {
    const {reader, promise} = makeStringFileReader();
    reader.readAsText(file);
    return promise;
};

export const readAsDataURL = (file: Blob) => {
    const {reader, promise} = makeStringFileReader();
    reader.readAsDataURL(file);
    return promise;
};
