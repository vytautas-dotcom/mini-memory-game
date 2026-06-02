export function generateNumber(length) {
  let num = "";
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

export async function setLanguage(lang) {

  const response =
    await fetch(`assets/${lang}.json`);

  const translations =
    await response.json();

  document
    .querySelectorAll("[data-i18n]")
    .forEach(el => {

      const key = el.dataset.i18n;

      if (translations[key]) {
        el.textContent = translations[key];
      }

    });

  localStorage.setItem("language", lang);
}