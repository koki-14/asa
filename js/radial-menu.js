// ======================================
// 要素取得
// ======================================

const menuBtn =
document.getElementById("SercleBtn");

const overlay =
document.getElementById("overlay");

const menuContainer =
document.getElementById("menuContainer");

const wheel =
document.getElementById("wheel");

const items =
document.querySelectorAll(".menu-item");

const selectedLabel =
document.getElementById("selectedLabel");


// ======================================
// 状態管理
// ======================================

// メニュー開閉状態
let isOpen = false;

// 現在角度
let currentRotation = 0;

// ドラッグ開始位置
let startX = 0;

// 前回位置
let previousX = 0;

// 慣性速度
let velocity = 0;

// ドラッグ中フラグ
let isDragging = false;

// requestAnimationFrame用
let animationId = null;


// ======================================
// メニュー開く
// ======================================

function openMenu(){

  isOpen = true;

  menuContainer.classList.add("show");

  overlay.classList.add("show");

  selectedLabel.classList.add("show");

}


// ======================================
// メニュー閉じる
// ======================================

function closeMenu(){

  isOpen = false;

  menuContainer.classList.remove("show");

  overlay.classList.remove("show");

  selectedLabel.classList.remove("show");

}


// ======================================
// Homeボタン
// ======================================

menuBtn.addEventListener("click",()=>{

  if(isOpen){

    closeMenu();

  }else{

    openMenu();

  }

});


// ======================================
// 背景タップで閉じる
// ======================================

overlay.addEventListener("click",()=>{

  closeMenu();

});


// ======================================
// ボタン配置更新
// ======================================

function updatePositions(){

  const radius = 140;

  items.forEach((item,index)=>{

    const angle =
      (
        index * 90 +
        currentRotation
      ) *
      Math.PI / 180;

    const x =
      Math.cos(angle)
      * radius;

    const y =
      Math.sin(angle)
      * radius;

    item.style.left =
      `${140 + x}px`;

    item.style.top =
      `${140 - y}px`;

  });

  updateSelected();

}


// ======================================
// 選択中判定
// ======================================

function updateSelected(){

  let selectedItem = null;

  let minDistance =
    Infinity;

  items.forEach(item=>{

    item.classList.remove(
      "active"
    );

    const top =
      parseFloat(
        item.style.top
      );

    const distance =
      Math.abs(
        top - 0
      );

    if(distance < minDistance){

      minDistance =
        distance;

      selectedItem =
        item;

    }

  });

  if(selectedItem){

    selectedItem
      .classList
      .add("active");

    selectedLabel.textContent =
      selectedItem.dataset.name;

  }

}


// ======================================
// Haptic
// ======================================

function vibrate(){

  if(
    "vibrate"
    in navigator
  ){

    navigator.vibrate(20);

  }

}


// ======================================
// タッチ開始
// ======================================

wheel.addEventListener(
  "touchstart",
  e=>{

    isDragging = true;

    startX =
      e.touches[0].clientX;

    previousX =
      startX;

    velocity = 0;

    cancelAnimationFrame(
      animationId
    );

  }
);


// ======================================
// タッチ移動
// ======================================

wheel.addEventListener(
  "touchmove",
  e=>{

    if(!isDragging)
      return;

    const currentX =
      e.touches[0].clientX;

    const delta =
      currentX
      - previousX;

    currentRotation +=
      delta * 0.5;

    velocity =
      delta;

    previousX =
      currentX;

    updatePositions();

  }
);


// ======================================
// タッチ終了
// ======================================

wheel.addEventListener(
  "touchend",
  ()=>{

    isDragging = false;

    startInertia();

  }
);


// ======================================
// 慣性回転
// ======================================

function startInertia(){

  function animate(){

    velocity *= 0.95;

    currentRotation +=
      velocity * 0.5;

    updatePositions();

    if(
      Math.abs(
        velocity
      ) > 0.2
    ){

      animationId =
      requestAnimationFrame(
        animate
      );

    }else{

      snapToNearest();

    }

  }

  animate();

}


// ======================================
// スナップ補正
// ======================================

function snapToNearest(){

  const step = 90;

  const target =
    Math.round(
      currentRotation
      / step
    ) * step;

  const start =
    currentRotation;

  const distance =
    target - start;

  const duration = 200;

  const startTime =
    performance.now();

  function animate(time){

    const progress =
      Math.min(
        (
          time -
          startTime
        ) / duration,
        1
      );

    currentRotation =
      start +
      distance *
      progress;

    updatePositions();

    if(progress < 1){

      requestAnimationFrame(
        animate
      );

    }else{

      vibrate();

    }

  }

  requestAnimationFrame(
    animate
  );

}


// ======================================
// 下方向スワイプで閉じる
// ======================================

let swipeStartY = 0;

wheel.addEventListener(
  "touchstart",
  e=>{

    swipeStartY =
      e.touches[0].clientY;

  }
);

wheel.addEventListener(
  "touchend",
  e=>{

    const endY =
      e.changedTouches[0]
      .clientY;

    const diff =
      endY -
      swipeStartY;

    if(diff > 120){

      closeMenu();

    }

  }
);


// ======================================
// ページ移動
// ======================================

items.forEach(item=>{

  item.addEventListener(
    "click",
    ()=>{

      const url =
        item.dataset.url;

      location.href =
        url;

    }
  );

});


// ======================================
// 初期化
// ======================================

updatePositions();