const VITE_URL = "http://localhost:5173";
document.body.innerHTML = `
<div
      id="app"
      style="
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <h1 style="color: #333">Vite Dev Mode</h1>
      <p style="color: #666">
        Cannot connect to the Vite Dev Server on <a href="${VITE_URL}">${VITE_URL}</a>
      </p>
      <p style="color: #666">
        Double-check that Vite is working and reload the extension.
      </p>
      <p style="color: #666">
        This page will close when the extension reloads.
      </p>
      <button
        style="
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: #fff;
          border-radius: 5px;
          cursor: pointer;
        "
      >
        Reload Extension
      </button>
    </div>`;
document.body.querySelector("button")?.addEventListener("click", () => {
  chrome.runtime.reload();
});
let tries = 0;
let ready = false;
do {
  try {
    await fetch(VITE_URL);
    ready = true;
  } catch {
    const timeout = Math.min(100 * Math.pow(2, ++tries), 5e3);
    console.log(`[CRXJS] Vite Dev Server is not available on ${VITE_URL}`);
    console.log(`[CRXJS] Retrying in ${timeout}ms...`);
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }
} while (!ready);
chrome.runtime.reload();
