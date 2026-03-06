const decisionTree = {
    "Indoors": {
        "Watch": { "relaxed": "movie night 🍿" },
        "Act": { "competitive": "game night 🎮" }
    },
    "Outdoors": {
        "Act": { "active": "badminton 🏸" },
        "Watch": { "aesthetic": "mystery🏮" }
    }
};

let currentStep = 1;
let userPath = [];

function updateUI() {
    const optionsContainer = document.getElementById('options');
    const questionText = document.getElementById('question-text');
    const stepCounter = document.getElementById('step-counter');
    const backBtn = document.getElementById('back-btn');
    const sceneImage = document.getElementById('scene-image');
    
    optionsContainer.innerHTML = '';
    stepCounter.innerText = `Step ${currentStep}`;

    // always show back button when question box is visible
    backBtn.classList.remove('hidden');

    let currentOptions = [];

    if (currentStep === 1) {
        questionText.innerText = "set the scene";
        currentOptions = Object.keys(decisionTree);
        sceneImage.classList.add('hidden');
    } 
    else if (currentStep === 2) {
        questionText.innerText = "what's the vibe?";
        currentOptions = Object.keys(decisionTree[userPath[0]]);

        // show indoor/outdoor image based on previous selection
        if (userPath[0] === 'Indoors') {
            sceneImage.src = 'Icons/Indoor.png';
            sceneImage.classList.remove('hidden');
        } else if (userPath[0] === 'Outdoors') {
            sceneImage.src = 'Icons/Outdoor.png';
            sceneImage.classList.remove('hidden');
        }
    } 
    else if (currentStep === 3) {
        questionText.innerText = "one last thing...";
        currentOptions = Object.keys(decisionTree[userPath[0]][userPath[1]]);
        sceneImage.classList.add('hidden');
    } 
    else {
        showFinalResult();
        return;
    }

    // if there's only one choice, auto-select it and continue
    if (currentOptions.length === 1) {
        selectOption(currentOptions[0]);
        return;
    }

    currentOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => selectOption(opt);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(option) {
    userPath.push(option);
    currentStep++;
    updateUI();
}

function showFinalResult() {
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    const finalActivity = decisionTree[userPath[0]][userPath[1]][userPath[2]];
    document.getElementById('result-text').innerText = finalActivity;

    const resultImage = document.getElementById('result-image');
    const details = document.getElementById('result-details');
    const dressCode = document.getElementById('dress-code');
    const bringList = document.getElementById('bring-list');

    resultImage.classList.add('hidden');
    details.classList.add('hidden');

    let dress = '';
    let bring = '';

    // Confetti only for Water Lantern Festival!
    if (finalActivity === "mystery🏮") {
        resultImage.src = "Icons/FortuneTT.png"
        resultImage.classList.remove('hidden');

        confetti({
            particleCount: 150,
            spread: 130,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#ffb4e1', '#b29090']
        });

        dress = 'Casual / smart casual (no Uniqlo tees)';
        bring = 'Bug spray, picnic rug (if you have one)', 'food and water (optional)';
    }

    // Show badminton image when badminton is selected
    if (finalActivity === "badminton 🏸") {
        resultImage.src = 'Icons/BadmintonLabubu.png';
        resultImage.classList.remove('hidden');

        dress = 'Sports fit';
        bring = 'Racquet, badminton shoes';
    }

    // Show Darius image when game night is selected
    if (finalActivity === "game night 🎮") {
        resultImage.src = 'Icons/Darius.jpg';
        resultImage.classList.remove('hidden');

        dress = "pjs or no clothes..";
        bring = "Darius or Cho'gath or eye ball or hooker";
    }

    // Show sleep image when movie night is selected
    if (finalActivity === "movie night 🍿") {
        resultImage.src = 'Icons/Sleep.png';
        resultImage.classList.remove('hidden');

        dress = "pjs or no clothes..";
        bring = "snacks and cuddles";
    }

    if (dress || bring) {
        dressCode.innerText = dress;
        bringList.innerText = bring;
        details.classList.remove('hidden');
    }
}

function handleYes() {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('crybaby').classList.add('hidden');

    clearFloatingHearts();
    generateFloatingIcons('Icons/Heart.png');

    updateUI();
}

function handleNo() {
    // show dark overlay when user chooses No on the landing step
    document.getElementById('overlay').classList.remove('hidden');

    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('result-text').innerText = "you just broke my heart 💔, transfer me $50 for emotional damage";
    document.querySelector('.reset-btn').innerText = "Give me another chance";

    // show crybaby image at top of card
    document.getElementById('crybaby').classList.remove('hidden');

    // switch floating icons to broken hearts
    clearFloatingHearts();
    generateFloatingIcons('Icons/broken-heart.png', 12);
}

function goBack() {
    if (currentStep <= 1) {
        // return to landing
        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('crybaby').classList.add('hidden');
        document.getElementById('question-box').classList.add('hidden');
        document.getElementById('landing-page').classList.remove('hidden');
        userPath = [];
        currentStep = 1;
        clearFloatingHearts();
        generateFloatingIcons('Icons/Heart.png');
        updateUI();
        return;
    }

    userPath.pop();
    currentStep = Math.max(1, currentStep - 1);
    updateUI();
}

// Initial Launch - set up event listeners
document.getElementById('yes-btn').onclick = handleYes;
document.getElementById('no-btn').onclick = handleNo;
document.getElementById('back-btn').onclick = goBack;

function clearFloatingHearts() {
    document.querySelectorAll('.floating-heart').forEach(el => el.remove());
}

// Generate floating icons based on screen size (hearts or broken hearts)
function generateFloatingIcons(src, countOverride) {
    const iconSize = 50;
    const numIcons = countOverride ?? Math.max(3, Math.floor((window.innerWidth * window.innerHeight) / 600000));
    const card = document.getElementById('app-container');
    const cardRect = card.getBoundingClientRect();
    const margin = 30; // keep this far from the card

    const placed = [];
    const minDist = 80; // minimum separation in pixels

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let attempts = 0;
    while (placed.length < numIcons && attempts < 600) {
        attempts++;

        const x = Math.random() * (vw - iconSize);
        const y = Math.random() * (vh - iconSize);

        // Avoid overlapping the card.
        if (
            x + iconSize > cardRect.left - margin &&
            x < cardRect.right + margin &&
            y + iconSize > cardRect.top - margin &&
            y < cardRect.bottom + margin
        ) {
            continue;
        }

        // Check against existing icons for spacing.
        let ok = true;
        const cx = x + iconSize / 2;
        const cy = y + iconSize / 2;
        for (const p of placed) {
            const dx = cx - p.cx;
            const dy = cy - p.cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                ok = false;
                break;
            }
        }
        if (!ok) continue;

        placed.push({ x, y, cx, cy });
    }

    // append to DOM
    placed.forEach(pos => {
        const icon = document.createElement('img');
        icon.src = src;
        icon.className = 'floating-heart';
        icon.style.top = pos.y + 'px';
        icon.style.left = pos.x + 'px';
        icon.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(icon);
    });
}

// Initial floating hearts
generateFloatingIcons('Icons/Heart.png');