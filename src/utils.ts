async function fetchData(
  url: string,
  params = "",
  onError: (data?: any) => void,
  errorMessage: string = "sm fetch data failed"
) {
  try {
    const res = await fetch(url + params);
    const data = await res.json();
    if (!res.ok) throw new Error(errorMessage);
    return data;
  } catch (error) {
    console.log(error);
    onError();
  }
}

function onError() {
  window.location.href = `${window.location.origin}/login`;
}

function getFormDataString(formData: any) {
  const values = [...formData.entries()];
  const stringValues = values.map(([key, value]) => [key, String(value)]);
  return new URLSearchParams(stringValues).toString();
}
export { fetchData, onError, getFormDataString };
