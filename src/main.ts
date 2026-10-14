const reveals = document.querySelectorAll<HTMLElement>(".reveal");
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
  { threshold: 0.12 },
);
reveals.forEach((element) => observer.observe(element));

const message = document.querySelector<HTMLElement>("#download-message");
document.querySelectorAll<HTMLButtonElement>(".download-card").forEach((card) => {
  card.addEventListener("click", () => {
    const edition = card.dataset.edition ?? "wybraną edycję";
    if (message) message.textContent = `${edition}: obraz instalacyjny jest jeszcze w przygotowaniu. Śledź changelog, aby poznać datę premiery.`;
  });
});
