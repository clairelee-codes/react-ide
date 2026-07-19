// useCallback제거 (react19 + 컴파일러 자동 생성)
export function useFileUpload(onFileLoaded, { onInvalidType } = {}) {
  return (e) => {
    const file = e.target.files[0];
    e.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.includes("text")) {
      onInvalidType?.();
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => onFileLoaded(event.target.result);
  };
}
