// src/utils/formDataUtils.ts

export const formDataToJson = (formData: FormData): { [key: string]: any } => {
  const json: { [key: string]: any } = {};

  formData.forEach((value, key) => {
    if (formData.getAll(key).length > 1) {
      json[key] = formData.getAll(key); // 여러 개의 값이 있으면 배열로 변환
    } else {
      json[key] = value; // 단일 값
    }
  });

  return json;
};
