import { Wallet } from "sats-connect";

export async function connectXverse() {
    try {
        const response = await Wallet.request('runes_getOrder', {
            id: "YOUR_ORDER_ID",
            network: "Mainnet"
        });

        if (response.status === 'success') {
            console.log("Total Cost: ", response.result.totalCost);
            console.log("Total Size: ", response.result.totalSize);
            displayConnectedWalletAddress(response.result.address);
            displayRuneBalance(response.result.address);
            fetchAndDisplayRunes(response.result.address);
        } else {
            console.error(response.error);
            alert('Error Fetching Estimate. See console for details.');
        }
    } catch (error) {
        console.error('Failed to connect Xverse wallet:', error);
    }
}

function displayConnectedWalletAddress(address) {
    const connectedWalletAddressDiv = document.getElementById("connected-wallet-address");
    connectedWalletAddressDiv.textContent = "Connected Wallet Address: " + address;
}

async function displayRuneBalance(address) {
    try {
        const runeId = "CAT•GO•TO•THE•SUN";
        const response = await fetch(`https://api.yourservice.com/runes_balance?address=${address}&runeId=${runeId}`);
        const data = await response.json();
        const balance = data.balance || 0;

        const runeBalanceDiv = document.getElementById("rune-balance");
        runeBalanceDiv.textContent = "Rune Balance: " + balance;
    } catch (error) {
        console.error('Failed to retrieve Rune balance:', error);
    }
}

async function fetchAndDisplayRunes(address) {
    try {
        const response = await fetch(`https://api.magiceden.io/runes?owner=${address}`);
        const data = await response.json();
        console.log("Response from fetch runes:", data);
        const runes = data.runes;

        if (Array.isArray(runes)) {
            const imageContainer = document.getElementById("image-container");
            runes.forEach(rune => {
                const runeDiv = document.createElement("div");
                runeDiv.className = "inscription-image-container";

                const img = document.createElement("img");
                img.src = rune.image;
                img.alt = rune.name;
                img.className = "inscription-image";

                const name = document.createElement("p");
                name.textContent = rune.name;

                runeDiv.appendChild(img);
                runeDiv.appendChild(name);
                imageContainer.appendChild(runeDiv);
            });
        } else {
            console.error('Invalid runes response format', runes);
        }
    } catch (error) {
        console.error('Failed to fetch and display runes:', error);
    }
}
