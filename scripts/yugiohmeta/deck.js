const getCardList = async (rawCardArray) => {
    const amountByCardName = new Map();

    for (let i = 0; i < rawCardArray.length; i++) {
        const currentCardName = rawCardArray[i]["card"]["name"];

        const currentCardAmount = amountByCardName.get(currentCardName);

        if (!currentCardAmount) {
            amountByCardName.set(currentCardName, rawCardArray[i]["amount"]);
        } else {
            amountByCardName.set(currentCardName, currentCardAmount + rawCardArray[i]["amount"]);
        }
    }

    const cardList = [];

    for (const [key, value] of amountByCardName.entries()) {
        cardList.push(`${value}x  ${key}`);
    }

    await navigator.clipboard.writeText(cardList.join("\n"));
};

const copyToClipboardAsDeckList = async () => {
    const urlParam = encodeURIComponent(
        "/" + window.location.href.split("/").slice(4).join("/") + "/"
    );

    const res = await fetch(`https://www.yugiohmeta.com/api/v1/top-decks?url=${urlParam}&limit=1`);

    const body = await res.json();
    const deckList = body[0];

    getCardList([...deckList["main"], ...deckList["extra"], ...deckList["side"]]);
};

const getNewShareOptionElement = (previousOption) => {
    const newShareOption = document.createElement("div");
    newShareOption.className = "listItem";
    newShareOption.tabIndex = -1;

    const child = document.createElement("div");
    child.className = "item svelte-vl66yx";
    child.textContent = "as CM Decklist to Clipboard";

    child.addEventListener("mouseenter", () => {
        if (previousOption) {
            previousOption.firstChild.classList.remove("hover");
        }

        child.classList.add("hover");
    });

    child.addEventListener("mouseleave", () => {
        child.classList.remove("hover");
    });

    newShareOption.appendChild(child);

    newShareOption.addEventListener("click", async () => {
        copyToClipboardAsDeckList();
    });

    return newShareOption;
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.className === "listContainer svelte-1wpw7dd") {
            const shareOptionsList = document.querySelector(".listContainer.svelte-1wpw7dd");

            if (!shareOptionsList) {
                return;
            }

            const newShareOption = getNewShareOptionElement(shareOptionsList.lastElementChild);

            shareOptionsList.appendChild(newShareOption);
        }
    });
});

observer.observe(document.body, {
    attributes: true,
    subtree: true,
});
