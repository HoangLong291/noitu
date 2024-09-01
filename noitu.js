Cookies.set("Ad", makeid(), {
    expires: 1000000000000000
})
const dashboard = document.createElement('div');
dashboard.id = 'dashboard';
dashboard.style.position = 'fixed';
dashboard.style.top = '10px';
dashboard.style.right = '10px';
dashboard.style.backgroundColor = 'rgba(0,0,0,0.8)';
dashboard.style.color = 'white';
dashboard.style.padding = '15px';
dashboard.style.borderRadius = '10px';
dashboard.style.fontSize = '16px';
dashboard.style.zIndex = '10000';
dashboard.style.maxWidth = '300px';
document.body.appendChild(dashboard);

const timeStampDisplay = document.createElement('div');
const winsDisplay = document.createElement('div');
const lossesDisplay = document.createElement('div');
dashboard.appendChild(timeStampDisplay);
dashboard.appendChild(winsDisplay);
dashboard.appendChild(lossesDisplay);

let startTime = Date.now();
let totalTime = 0;
let wins = 0;
let losses = 0;

function updateDashboard() {
    const now = Date.now();
    totalTime = Math.floor((now - startTime) / 1000);
    const hours = String(Math.floor(totalTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0');
    const secs = String(totalTime % 60).padStart(2, '0');
    timeStampDisplay.textContent = `Time spent: ${hours}:${minutes}:${secs}`;
    winsDisplay.textContent = `Wins: ${wins}`;
    lossesDisplay.textContent = `Losses: ${losses}`;
}

setInterval(updateDashboard, 1000);

const currentWordSpan = document.getElementById('currentWord');
const textInput = document.getElementById('text');

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            if (textInput.disabled) return;

            const currentWord = currentWordSpan.innerText.trim();
            fetch(`https://noitu.pro/answer?word=${encodeURIComponent(currentWord)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.nextWord) {
                        if (data.win) {
                            const head = currentWord.split(' ')[0];
                            textInput.value = head;
                            textInput.dispatchEvent(new Event('input', { bubbles: true }));
                            const event = new KeyboardEvent('keydown', {
                                bubbles: true,
                                cancelable: true,
                                key: 'Enter',
                                keyCode: 13
                            });
                            textInput.dispatchEvent(event);
                            return;
                        }

                        const tail = data.nextWord.tail;
                        textInput.value = tail;
                        textInput.dispatchEvent(new Event('input', { bubbles: true }));
                        const event = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            key: 'Enter',
                            keyCode: 13
                        });
                        textInput.dispatchEvent(event);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});

observer.observe(currentWordSpan, { childList: true });

const modalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        const modal = document.querySelector('.swal-modal');
        const overlay = document.querySelector('.swal-overlay');
        
        if (modal) {
            const title = modal.querySelector('.swal-title').textContent.trim();
            const text = modal.querySelector('.swal-text').textContent.trim();
            
            if (title.includes('Trò chơi kết thúc') && text.includes('Bạn đã dành chiến thắng')) {
                const playAgainButton = modal.querySelector('.swal-button.swal-button--confirm');
                if (playAgainButton) {
                    playAgainButton.click();
                    wins++;
                    displayWinMessage();
                    modal.remove();
                    if (overlay) overlay.remove();
                }
            } else if (title.includes('Trò chơi kết thúc') && text.includes('Bạn đã thua')) {
                const playAgainButton = modal.querySelector('.swal-button.swal-button--confirm');
                if (playAgainButton) {
                    playAgainButton.click();
                    losses++;
                    displayLoseMessage();
                    modal.remove();
                    if (overlay) overlay.remove();
                }
            }
        }
    });
});

modalObserver.observe(document.body, { childList: true, subtree: true });

function displayLoseMessage() {
    const loseMessage = document.createElement('div');
    loseMessage.textContent = "You lose!";
    loseMessage.style.color = 'red';
    loseMessage.style.fontWeight = 'bold';
    dashboard.appendChild(loseMessage);
    setTimeout(() => {
        loseMessage.remove();
    }, 3000);
}

function displayWinMessage() {
    const winMessage = document.createElement('div');
    winMessage.textContent = "You win!";
    winMessage.style.color = 'green';
    winMessage.style.fontWeight = 'bold';
    dashboard.appendChild(winMessage);
    setTimeout(() => {
        winMessage.remove();
    }, 3000);
}
