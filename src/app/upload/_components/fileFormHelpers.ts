export const getFileNames = (files: FileList | undefined) => {
  if (!files) {
    return [];
  }
  const names: string[] = [];
  for (const file of files) {
    names.push(file.name);
  }
  return names;
};

export const hasCorrectFilenames = (
  fileList: FileList,
): { success: boolean; name: string } => {
  const pattern = /.+_.+\.csv/;
  for (const file of fileList) {
    const filename = file.name;
    if (!pattern.test(filename)) {
      return { success: false, name: filename };
    }
  }
  return { success: true, name: "" };
};
