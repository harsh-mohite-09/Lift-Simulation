const floorsInput = document.getElementById("floor-input");
const liftsInput = document.getElementById("lift-input");
const submitBtn = document.getElementById("submit");
const formSection = document.querySelector(".form-section");
const form = document.getElementById("form");
const liftContainer = document.getElementById("lift-container");
const lifts = document.getElementById("lifts");
const liftQueue = [];
const liftState = [];

let buttons;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  createFloorsAndLifts(+floorsInput.value, +liftsInput.value);
});

// Craete Floors and List Dynamically

const createFloorsAndLifts = (floorsInput, liftsInput) => {
  liftContainer.classList.remove("hide");
  for (let i = floorsInput; i > 0; i--) {
    const floor = document.createElement("div");
    floor.id = "floor-container";
    floor.innerHTML = `<div>
                        <div class="btn-group">
                            <button id="floor-${i}" class="lift-btn">Up</button>
                            <button id="floor-${i}" class="lift-btn">Down</button>
                        </div>
                        <span>Floor ${i}</span>
                        </div>
                        <hr />`;
    liftContainer.insertAdjacentElement("beforebegin", floor);
  }
  for (let i = 0; i < liftsInput; i++) {
    const lift = document.createElement("div");
    lift.id = i + 1;
    lift.classList.add(`lift-${i + 1}`);
    lifts.appendChild(lift);
    liftState.push({ liftId: i + 1, floorId: 0 });
  }

  formSection.classList.add("hide");

  liftButtons = document.querySelectorAll(".lift-btn");

  liftButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const floorNumber = +e.target.id.split("-")[1];

      moveLift(floorNumber, getLiftToMove(liftState, floorNumber));
    });
  });
};

const moveLift = (floorNumber, liftToMove) => {
  const lift = document.querySelector(`.lift-${liftToMove}`);

  const translateValue = `translateY(${-12.5 - 12 * (floorNumber - 1)}rem)`;
  lift.style.transform = translateValue;
  const transitionTimeFactor = getTransitionTime(floorNumber, +lift.id);
  lift.style.transition = `transform ${2 * transitionTimeFactor}s linear`;

  liftQueue.push({
    lift: +lift.id,
    floor: floorNumber,
    time: 2000 * transitionTimeFactor,
  });

  setTimeout(() => {
    liftQueue.shift();
    liftState.find(({ liftId }) => liftId === +lift.id).floorId = floorNumber;
  }, 2000 * transitionTimeFactor);
};

const getTransitionTime = (floorNumber, liftNumber) => {
  return Math.abs(
    floorNumber - liftState.find(({ liftId }) => liftId === liftNumber).floorId
  );
};

// Find the nearest lift
const getLiftToMove = (liftState, floorNumber) => {
  let temp = Infinity;
  let result;
  for (let i = 0; i < liftState.length; i++) {
    let diff = Math.abs(liftState[i].floorId - floorNumber);
    if (diff < temp) {
      result = liftState[i].liftId;
      temp = diff;
    }
  }
  return result;
};
