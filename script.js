const exp = document.getElementById('experience');
const screens = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.progress button')];

let current = 0;
let locked = false;

function go(i) {
    i = Math.max(0, Math.min(screens.length - 1, i));
    current = i;

    screens[i].scrollIntoView({
        behavior: 'smooth',
        inline: 'start'
    });

    dots.forEach((d, n) => {
        d.classList.toggle('active', n === i);
    });
}

document.querySelectorAll('[data-next]').forEach(b => {
    b.onclick = () => go(current + 1);
});

dots.forEach(d => {
    d.onclick = () => go(+d.dataset.go);
});

exp.addEventListener('scroll', () => {
    const i = Math.round(exp.scrollLeft / innerWidth);

    if (i !== current) {
        current = i;

        dots.forEach((d, n) => {
            d.classList.toggle('active', n === i);
        });
    }
});

const env = document.getElementById('envelope');

exp.addEventListener('wheel', e => {
    // Permite rolar a carta normalmente quando ela estiver aberta
    if (
        env.classList.contains('open') &&
        e.target.closest('.paper')
    ) {
        return;
    }

    if (Math.abs(e.deltaY) < 5 || locked) {
        return;
    }

    e.preventDefault();
    locked = true;

    go(current + (e.deltaY > 0 ? 1 : -1));

    setTimeout(() => {
        locked = false;
    }, 700);
}, {
    passive: false
});

addEventListener('keydown', e => {
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        go(current + 1);
    }

    if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(current - 1);
    }

    if (e.key === 'Home') {
        go(0);
    }

    if (e.key === 'End') {
        go(5);
    }
});

let sx = 0;
let sy = 0;

exp.addEventListener('touchstart', e => {
    sx = e.changedTouches[0].clientX;
    sy = e.changedTouches[0].clientY;
}, {
    passive: true
});

exp.addEventListener('touchend', e => {
    // Se estiver lendo a carta, não troca de tela
    if (
        env.classList.contains('open') &&
        e.target.closest('.paper')
    ) {
        return;
    }

    const x = e.changedTouches[0].clientX - sx;
    const y = e.changedTouches[0].clientY - sy;

    if (
        Math.abs(x) > 50 &&
        Math.abs(x) > Math.abs(y)
    ) {
        go(current + (x < 0 ? 1 : -1));
    }
}, {
    passive: true
});

const msgs = [
    [
        'Respira.',
        'Você não precisa ser forte hoje.'
    ],
    [
        'Pode sentir saudade.',
        'Não precisa esconder o que está sentindo.'
    ],
    [
        'Se quiser chorar, chore.',
        'Eu continuo aqui com você.'
    ],
    [
        'Se quiser falar sobre ela, eu vou te ouvir.',
        'Pode me contar qualquer coisa.'
    ],
    [
        'Você não está sozinha.',
        'Meu ombro estará sempre aqui.'
    ]
];

let mi = 0;

const card = document.querySelector('.message-card');
const msg = document.getElementById('comfortMessage');
const sub = document.getElementById('comfortSub');
const counter = document.getElementById('counter');
const dotsBox = document.getElementById('dots');

msgs.forEach((_, i) => {
    const d = document.createElement('span');

    d.className = 'dot' + (!i ? ' active' : '');

    dotsBox.appendChild(d);
});

function show(i) {
    mi = (i + msgs.length) % msgs.length;

    card.classList.add('changing');

    setTimeout(() => {
        msg.textContent = msgs[mi][0];
        sub.textContent = msgs[mi][1];
        counter.textContent = `${mi + 1} / ${msgs.length}`;

        [...dotsBox.children].forEach((d, n) => {
            d.classList.toggle('active', n === mi);
        });

        card.classList.remove('changing');
    }, 180);
}

document.getElementById('comfortButton').onclick = () => {
    show(mi + 1);
};

document.getElementById('next').onclick = () => {
    show(mi + 1);
};

document.getElementById('prev').onclick = () => {
    show(mi - 1);
};

document.getElementById('openLetter').onclick = e => {
    e.stopPropagation();
    env.classList.add('open');
};

document.getElementById('closeLetter').onclick = () => {
    env.classList.remove('open');
};