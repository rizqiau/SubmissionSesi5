const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  // Tambahkan pesan "Gemini is thinking..."
  const thinkingMessage = appendMessage("bot", "Gemini is thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Hapus pesan "Gemini is thinking..." setelah menerima balasan
    chatBox.removeChild(thinkingMessage);
    appendMessage("bot", data.reply);
  } catch (error) {
    console.error("Error sending message:", error);
    // Hapus pesan "Gemini is thinking..." jika terjadi error
    chatBox.removeChild(thinkingMessage);
    appendMessage("bot", "Oops! Something went wrong. Please try again.");
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Kembalikan elemen pesan agar bisa dihapus/diperbarui
}
