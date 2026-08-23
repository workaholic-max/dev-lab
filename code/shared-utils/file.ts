export const downloadFile = (data: BlobPart, fullName: string) => {
    const url = window.URL.createObjectURL(new Blob([data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fullName);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
