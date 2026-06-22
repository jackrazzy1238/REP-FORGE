const weekNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shortWeekNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const sectionNames = ['Main Lifts', 'Abs/Core', 'Cardio', 'Mobility'];
const storageKey = 'repforge-calendar-days';

const dayPresets = {
  'Push Day': {
    type: 'lift',
    workout: 'Chest / Shoulders / Triceps',
    minutes: 65,
    sections: [
      makeSection('Main Lifts', [
        makeLift('Bench Press', 4, '5', 225),
        makeLift('Incline DB Press', 3, '8-10', 85),
        makeLift('Overhead Tricep Ext', 3, '12', 60),
        makeLift('Lateral Raises', 4, '15', 25)
      ]),
      makeSection('Abs/Core', [
        makeLift('Plank', 3, '45 sec', 0),
        makeLift('Cable Crunch', 3, '15', 60)
      ])
    ],
    recovery: []
  },
  'Pull Day': {
    type: 'lift',
    workout: 'Back / Biceps / Forearms',
    minutes: 55,
    sections: [
      makeSection('Main Lifts', [
        makeLift('Deadlift', 4, '3', 315),
        makeLift('Lat Pulldown', 4, '10', 140),
        makeLift('Seated Row', 3, '12', 125)
      ]),
      makeSection('Abs/Core', [
        makeLift('Hanging Knee Raise', 3, '12', 0)
      ]),
      makeSection('Cardio', [
        makeLift('Incline Walk', 1, '15 min', 0)
      ])
    ],
    recovery: []
  },
  'Leg Day': {
    type: 'lift',
    workout: 'Legs',
    minutes: 70,
    sections: [
      makeSection('Main Lifts', [
        makeLift('Back Squat', 5, '5', 245),
        makeLift('Romanian Deadlift', 3, '8', 185),
        makeLift('Walking Lunges', 3, '12/leg', 40)
      ]),
      makeSection('Abs/Core', [
        makeLift('Russian Twists', 3, '20', 25)
      ]),
      makeSection('Cardio', [
        makeLift('Bike Cooldown', 1, '10 min', 0)
      ])
    ],
    recovery: []
  },
  'Rest Day': {
    type: 'rest',
    workout: 'Recovery Work',
    minutes: 35,
    sections: [],
    recovery: [
      makeRecovery('Stretching', '15 min', 'Hips, hamstrings, chest, and shoulders'),
      makeRecovery('Light walk', '20 min', 'Keep it easy and relaxed'),
      makeRecovery('Hydration check', 'All day', 'Keep water nearby')
    ]
  }
};

const workoutGenerators = {
  explosive: {
    'Push Day': [
      makeSection('Main Lifts', [
        makeLift('Push Press', 5, '3', 0),
        makeLift('Speed Bench Press', 6, '3', 0),
        makeLift('Plyometric Push-Ups', 4, '5', 0),
        makeLift('Medicine Ball Chest Throw', 4, '6', 0)
      ]),
      makeSection('Abs/Core', [makeLift('Explosive Sit-Ups', 3, '10', 0)])
    ],
    'Pull Day': [
      makeSection('Main Lifts', [
        makeLift('Power Clean', 5, '3', 0),
        makeLift('Barbell High Pull', 4, '4', 0),
        makeLift('Explosive Pull-Ups', 4, '5', 0),
        makeLift('Kettlebell Swings', 4, '12', 0)
      ]),
      makeSection('Abs/Core', [makeLift('Hanging Knee Raise', 3, '12', 0)])
    ],
    'Leg Day': [
      makeSection('Main Lifts', [
        makeLift('Box Jumps', 5, '3', 0),
        makeLift('Jump Squats', 4, '5', 0),
        makeLift('Hang Power Clean', 5, '3', 0),
        makeLift('Speed Deadlift', 6, '2', 0)
      ]),
      makeSection('Abs/Core', [makeLift('Medicine Ball Slams', 4, '8', 0)])
    ]
  },
  strength: {
    'Push Day': [
      makeSection('Main Lifts', [
        makeLift('Bench Press', 5, '3', 0),
        makeLift('Overhead Press', 5, '5', 0),
        makeLift('Close-Grip Bench Press', 4, '6', 0)
      ])
    ],
    'Pull Day': [
      makeSection('Main Lifts', [
        makeLift('Deadlift', 5, '3', 0),
        makeLift('Weighted Pull-Ups', 5, '5', 0),
        makeLift('Barbell Row', 4, '6', 0),
        makeLift('Farmer Carry', 4, '40 yd', 0)
      ])
    ],
    'Leg Day': [
      makeSection('Main Lifts', [
        makeLift('Back Squat', 5, '3', 0),
        makeLift('Front Squat', 4, '5', 0),
        makeLift('Romanian Deadlift', 4, '6', 0),
        makeLift('Bulgarian Split Squat', 3, '6/leg', 0)
      ])
    ]
  },
  hypertrophy: {
    'Push Day': [
      makeSection('Main Lifts', [
        makeLift('Incline DB Press', 4, '8-12', 0),
        makeLift('Machine Chest Press', 3, '10-12', 0),
        makeLift('Cable Fly', 3, '12-15', 0),
        makeLift('Lateral Raises', 4, '15-20', 0),
        makeLift('Triceps Pushdown', 4, '10-15', 0)
      ])
    ],
    'Pull Day': [
      makeSection('Main Lifts', [
        makeLift('Lat Pulldown', 4, '8-12', 0),
        makeLift('Chest-Supported Row', 4, '10-12', 0),
        makeLift('Rear Delt Fly', 3, '15-20', 0),
        makeLift('EZ-Bar Curl', 4, '10-12', 0),
        makeLift('Reverse Curl', 3, '12-15', 0)
      ])
    ],
    'Leg Day': [
      makeSection('Main Lifts', [
        makeLift('Hack Squat', 4, '8-12', 0),
        makeLift('Romanian Deadlift', 4, '8-12', 0),
        makeLift('Leg Press', 4, '12-15', 0),
        makeLift('Leg Curl', 3, '12-15', 0),
        makeLift('Calf Raises', 4, '15-20', 0)
      ])
    ]
  },
  conditioning: {
    'Push Day': [
      makeSection('Main Lifts', [
        makeLift('DB Push Press', 4, '12', 0),
        makeLift('Push-Ups', 4, 'AMRAP', 0),
        makeLift('Battle Ropes', 6, '30 sec', 0)
      ]),
      makeSection('Cardio', [makeLift('Rowing Intervals', 8, '30 sec', 0)])
    ],
    'Pull Day': [
      makeSection('Main Lifts', [
        makeLift('Kettlebell Swings', 5, '15', 0),
        makeLift('Inverted Rows', 4, '12', 0),
        makeLift('Farmer Carry', 5, '40 yd', 0)
      ]),
      makeSection('Cardio', [makeLift('Ski Erg Intervals', 8, '30 sec', 0)])
    ],
    'Leg Day': [
      makeSection('Main Lifts', [
        makeLift('Goblet Squat', 4, '15', 0),
        makeLift('Walking Lunges', 4, '20 steps', 0),
        makeLift('Sled Push', 6, '30 yd', 0)
      ]),
      makeSection('Cardio', [makeLift('Bike Sprints', 8, '20 sec', 0)])
    ]
  }
};

const starterPlan = [
  makePresetDay(0, 'Push Day'),
  makePresetDay(1, 'Pull Day'),
  makePresetDay(2, 'Leg Day'),
  makePresetDay(3, 'Rest Day'),
  makePresetDay(4, 'Push Day'),
  makePresetDay(5, 'Pull Day'),
  makePresetDay(6, 'Leg Day')
];

let days = loadDays();
let activeDayIndex = 0;
let calendarCursor = new Date(`${days[activeDayIndex].date}T00:00:00`);

const dayList = document.querySelector('#dayList');
const calendarGrid = document.querySelector('#calendarGrid');
const calendarTitle = document.querySelector('#calendarTitle');
const liftList = document.querySelector('#liftList');
const recoveryList = document.querySelector('#recoveryList');
const liftTemplate = document.querySelector('#liftTemplate');
const sectionTemplate = document.querySelector('#sectionTemplate');
const recoveryTemplate = document.querySelector('#recoveryTemplate');
const dayName = document.querySelector('#dayName');
const dayDate = document.querySelector('#dayDate');
const workoutName = document.querySelector('#workoutName');
const estimatedTime = document.querySelector('#estimatedTime');
const workoutHeading = document.querySelector('#workoutHeading');
const workoutSubheading = document.querySelector('#workoutSubheading');
const addSectionBtn = document.querySelector('#addSectionBtn');
const workoutStyle = document.querySelector('#workoutStyle');
const generateWorkoutBtn = document.querySelector('#generateWorkoutBtn');
const addRecoveryBtn = document.querySelector('#addRecoveryBtn');

document.querySelector('#resetWeekBtn').addEventListener('click', resetWeek);
document.querySelector('#prevMonthBtn').addEventListener('click', () => changeMonth(-1));
document.querySelector('#nextMonthBtn').addEventListener('click', () => changeMonth(1));
addSectionBtn.addEventListener('click', addSection);
generateWorkoutBtn.addEventListener('click', generateWorkout);
addRecoveryBtn.addEventListener('click', addRecovery);

[workoutName, estimatedTime].forEach((field) => {
  field.addEventListener('input', updateActiveDay);
});
dayName.addEventListener('change', applySelectedDayPreset);
dayDate.addEventListener('input', updateActiveDate);

render();

function loadDays() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return structuredClone(starterPlan);

  try {
    const parsed = JSON.parse(saved);
    return normalizeDays(parsed);
  } catch {
    return structuredClone(starterPlan);
  }
}

function normalizeDays(savedDays) {
  const source = Array.isArray(savedDays) && savedDays.length ? savedDays : starterPlan;
  return source.map((day) => {
    const name = normalizeDayName(day.name || (day.type === 'rest' ? 'Rest Day' : 'Push Day'));
    const preset = dayPresets[name];

    return {
      date: day.date || todayString(),
      weekDay: getWeekDay(day.date),
      name,
      workout: day.workout || preset.workout,
      minutes: Number(day.minutes) || preset.minutes,
      type: preset.type,
      sections: normalizeSections(day.sections, day.lifts, preset.sections),
      lifts: [],
      recovery: Array.isArray(day.recovery) ? day.recovery.map(cleanRecovery) : structuredClone(preset.recovery)
    };
  }).sort(sortByDate);
}

function normalizeSections(sections, legacyLifts, presetSections) {
  if (Array.isArray(sections) && sections.length) {
    return mergeDuplicateSections(sections.map(cleanSection));
  }

  if (Array.isArray(legacyLifts) && legacyLifts.length) {
    return [makeSection('Main Lifts', legacyLifts.map(cleanLift))];
  }

  return mergeDuplicateSections(structuredClone(presetSections));
}

function mergeDuplicateSections(sections) {
  return sections.reduce((merged, section) => {
    const existing = merged.find((item) => item.name === section.name);
    if (existing) {
      existing.lifts.push(...section.lifts);
    } else {
      merged.push(section);
    }
    return merged;
  }, []);
}

function saveDays() {
  localStorage.setItem(storageKey, JSON.stringify(days));
}

function render() {
  renderCalendar();
  renderDayTabs();
  renderActiveDay();
}

function renderCalendar() {
  calendarGrid.innerHTML = '';
  calendarTitle.textContent = `${monthNames[calendarCursor.getMonth()]} ${calendarCursor.getFullYear()}`;

  const first = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);

  for (let i = 0; i < 42; i += 1) {
    const cellDate = new Date(start);
    cellDate.setDate(start.getDate() + i);
    const dateValue = toDateValue(cellDate);
    const day = findDay(dateValue);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = [
      'calendar-day',
      cellDate.getMonth() !== calendarCursor.getMonth() ? 'outside' : '',
      day ? 'planned' : '',
      day?.type === 'rest' ? 'rest' : '',
      days[activeDayIndex]?.date === dateValue ? 'active' : ''
    ].filter(Boolean).join(' ');
    button.innerHTML = `<strong>${cellDate.getDate()}</strong><span>${day ? escapeHtml(day.name) : ''}</span>`;
    button.addEventListener('click', () => selectCalendarDate(dateValue));
    calendarGrid.append(button);
  }
}

function renderDayTabs() {
  const activeDate = days[activeDayIndex]?.date;
  days.sort(sortByDate);
  activeDayIndex = Math.max(0, days.findIndex((day) => day.date === activeDate));
  dayList.innerHTML = '';
  days.forEach((day, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `day-tab${index === activeDayIndex ? ' active' : ''}${day.type === 'rest' ? ' rest' : ''}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(index === activeDayIndex));
    button.innerHTML = `<span>${escapeHtml(day.weekDay || getWeekDay(day.date))}</span><strong>${escapeHtml(day.name || 'Day')}</strong><small>${day.type === 'rest' ? 'Rest' : 'Lift'} - ${formatShortDate(day.date)}</small>`;
    button.addEventListener('click', () => {
      activeDayIndex = index;
      calendarCursor = new Date(`${day.date}T00:00:00`);
      render();
    });
    dayList.append(button);
  });
}

function renderActiveDay() {
  const day = days[activeDayIndex];
  dayName.value = normalizeDayName(day.name);
  dayDate.value = day.date || '';
  workoutName.value = day.workout || '';
  estimatedTime.value = day.minutes || '';
  updateWorkoutTitle(day);
  addSectionBtn.hidden = day.type === 'rest';
  addRecoveryBtn.hidden = day.type !== 'rest';
  liftList.hidden = day.type === 'rest';
  recoveryList.hidden = day.type !== 'rest';
  liftList.innerHTML = '';
  recoveryList.innerHTML = '';

  if (day.type === 'rest') {
    renderRecovery(day);
  } else {
    renderSections(day);
  }
}

function renderSections(day) {
  if (!day.sections.length) day.sections.push(makeSection('Main Lifts', [makeLift('New Lift', 3, '10', 0)]));
  day.sections = mergeDuplicateSections(day.sections.map(cleanSection));

  day.sections.forEach((section, sectionIndex) => {
    const sectionRow = sectionTemplate.content.firstElementChild.cloneNode(true);
    const sectionName = sectionRow.querySelector('.section-name');
    const sectionLifts = sectionRow.querySelector('.section-lifts');
    sectionName.value = sectionNames.includes(section.name) ? section.name : 'Main Lifts';
    sectionName.addEventListener('change', () => {
      section.name = sectionName.value;
      saveDays();
      renderCalendar();
      renderDayTabs();
    });
    sectionRow.querySelector('.add-section-lift').addEventListener('click', () => addSectionLift(sectionIndex));
    sectionRow.querySelector('.remove-section').addEventListener('click', () => removeSection(sectionIndex));

    if (!section.lifts.length) section.lifts.push(makeLift('New Exercise', 3, '10', 0));
    section.lifts.forEach((lift, liftIndex) => {
      const row = liftTemplate.content.firstElementChild.cloneNode(true);
      row.querySelector('.lift-number').textContent = liftIndex + 1;
      bindInput(row, '.lift-name', lift.name, (value) => lift.name = value);
      bindInput(row, '.lift-sets', lift.sets, (value) => lift.sets = Number(value) || 0);
      bindInput(row, '.lift-reps', lift.reps, (value) => lift.reps = value);
      bindInput(row, '.lift-weight', lift.weight, (value) => lift.weight = Number(value) || 0);
      row.querySelector('.remove-button').addEventListener('click', () => removeSectionLift(sectionIndex, liftIndex));
      sectionLifts.append(row);
    });

    liftList.append(sectionRow);
  });
}

function renderRecovery(day) {
  if (!day.recovery.length) day.recovery.push(makeRecovery('Stretching', '15 min', 'Easy mobility'));

  day.recovery.forEach((item, index) => {
    const row = recoveryTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector('.lift-number').textContent = index + 1;
    bindInput(row, '.recovery-name', item.name, (value) => item.name = value);
    bindInput(row, '.recovery-time', item.time, (value) => item.time = value);
    bindInput(row, '.recovery-notes', item.notes, (value) => item.notes = value);
    row.querySelector('.remove-button').addEventListener('click', () => removeRecovery(index));
    recoveryList.append(row);
  });
}

function bindInput(row, selector, value, update) {
  const input = row.querySelector(selector);
  input.value = value;
  input.addEventListener('input', () => {
    update(input.value);
    saveDays();
    renderCalendar();
    renderDayTabs();
  });
}

function updateActiveDay() {
  const day = days[activeDayIndex];
  day.workout = workoutName.value;
  day.minutes = Number(estimatedTime.value) || 0;
  saveDays();
  renderCalendar();
  renderDayTabs();
  updateWorkoutTitle(day);
}

function updateWorkoutTitle(day) {
  workoutHeading.textContent = day.name || 'Workout Day';
  workoutSubheading.textContent = day.workout || (day.type === 'rest' ? 'Recovery Work' : 'Workout Focus');
}

function applySelectedDayPreset() {
  const day = days[activeDayIndex];
  applyPreset(day, dayName.value);
  saveDays();
  render();
}

function updateActiveDate() {
  const day = days[activeDayIndex];
  if (!dayDate.value) return;
  day.date = dayDate.value;
  day.weekDay = getWeekDay(day.date);
  calendarCursor = new Date(`${day.date}T00:00:00`);
  saveDays();
  render();
}

function selectCalendarDate(dateValue) {
  let index = days.findIndex((day) => day.date === dateValue);
  if (index === -1) {
    days.push(makeBlankDay(dateValue));
    days.sort(sortByDate);
    index = days.findIndex((day) => day.date === dateValue);
  }
  activeDayIndex = index;
  calendarCursor = new Date(`${dateValue}T00:00:00`);
  saveDays();
  render();
}

function changeMonth(direction) {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + direction, 1);
  renderCalendar();
}

function addSection() {
  const day = days[activeDayIndex];
  day.sections.push(makeSection('Abs/Core', [makeLift('New Exercise', 3, '10', 0)]));
  saveDays();
  renderActiveDay();
}

function generateWorkout() {
  const day = days[activeDayIndex];
  const normalizedName = normalizeDayName(day.name);
  const style = workoutStyle.value;

  applyPreset(day, normalizedName);
  if (day.type === 'lift' && style !== 'standard') {
    day.sections = structuredClone(workoutGenerators[style][normalizedName]);
  }
  saveDays();
  render();
}

function removeSection(sectionIndex) {
  const sections = days[activeDayIndex].sections;
  sections.splice(sectionIndex, 1);
  if (!sections.length) sections.push(makeSection('Main Lifts', [makeLift('New Exercise', 3, '10', 0)]));
  saveDays();
  renderActiveDay();
}

function addSectionLift(sectionIndex) {
  days[activeDayIndex].sections[sectionIndex].lifts.push(makeLift('New Exercise', 3, '10', 0));
  saveDays();
  renderActiveDay();
}

function removeSectionLift(sectionIndex, liftIndex) {
  const lifts = days[activeDayIndex].sections[sectionIndex].lifts;
  lifts.splice(liftIndex, 1);
  if (!lifts.length) lifts.push(makeLift('New Exercise', 3, '10', 0));
  saveDays();
  renderActiveDay();
}

function addRecovery() {
  days[activeDayIndex].recovery.push(makeRecovery('New recovery', '10 min', 'Add a note'));
  saveDays();
  renderActiveDay();
}

function removeRecovery(index) {
  const recovery = days[activeDayIndex].recovery;
  recovery.splice(index, 1);
  if (!recovery.length) recovery.push(makeRecovery('New recovery', '10 min', 'Add a note'));
  saveDays();
  renderActiveDay();
}

function resetWeek() {
  days = structuredClone(starterPlan);
  activeDayIndex = 0;
  calendarCursor = new Date(`${days[0].date}T00:00:00`);
  saveDays();
  render();
}

function makeDay(dayOffset, name, workout, type, minutes, sections = [], recovery = []) {
  const date = dateForWeekDay(dayOffset);
  return {
    date,
    weekDay: getWeekDay(date),
    name,
    workout,
    type,
    sections,
    lifts: [],
    minutes,
    recovery
  };
}

function makePresetDay(dayOffset, presetName) {
  const preset = dayPresets[presetName];
  return makeDay(
    dayOffset,
    presetName,
    preset.workout,
    preset.type,
    preset.minutes,
    structuredClone(preset.sections),
    structuredClone(preset.recovery)
  );
}

function makeBlankDay(date) {
  const day = {
    date,
    weekDay: getWeekDay(date),
    name: 'Push Day',
    workout: '',
    type: 'lift',
    sections: [],
    lifts: [],
    minutes: 45,
    recovery: []
  };
  applyPreset(day, 'Push Day');
  return day;
}

function makeSection(name, lifts = []) {
  return { name, lifts };
}

function makeLift(name, sets, reps, weight) {
  return { name, sets, reps, weight };
}

function makeRecovery(name, time, notes) {
  return { name, time, notes };
}

function cleanSection(section) {
  const name = section.name === 'Accessories'
    ? 'Main Lifts'
    : section.name;

  return makeSection(
    sectionNames.includes(name) ? name : 'Main Lifts',
    Array.isArray(section.lifts) ? section.lifts.map(cleanLift) : [makeLift('New Exercise', 3, '10', 0)]
  );
}

function cleanLift(lift) {
  return makeLift(lift.name || 'New Exercise', Number(lift.sets) || 0, lift.reps || '', Number(lift.weight) || 0);
}

function cleanRecovery(item) {
  return makeRecovery(item.name || 'New recovery', item.time || '', item.notes || '');
}

function applyPreset(day, presetName) {
  const normalizedName = normalizeDayName(presetName);
  const preset = dayPresets[normalizedName];
  day.name = normalizedName;
  day.type = preset.type;
  day.workout = preset.workout;
  day.minutes = preset.minutes;
  day.sections = structuredClone(preset.sections);
  day.lifts = [];
  day.recovery = structuredClone(preset.recovery);
}

function normalizeDayName(name) {
  if (dayPresets[name]) return name;
  const lower = String(name || '').toLowerCase();
  if (lower.includes('pull')) return 'Pull Day';
  if (lower.includes('leg') || lower.includes('lower')) return 'Leg Day';
  if (lower.includes('rest') || lower.includes('recover')) return 'Rest Day';
  return 'Push Day';
}

function findDay(dateValue) {
  return days.find((day) => day.date === dateValue);
}

function sortByDate(a, b) {
  return a.date.localeCompare(b.date);
}

function dateForWeekDay(index) {
  const monday = getThisMonday();
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);
  return toDateValue(date);
}

function getThisMonday() {
  const today = new Date();
  const day = today.getDay();
  const distance = day === 0 ? -6 : 1 - day;
  today.setDate(today.getDate() + distance);
  today.setHours(0, 0, 0, 0);
  return today;
}

function todayString() {
  return toDateValue(new Date());
}

function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekDay(dateValue) {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T00:00:00`);
  return weekNames[(date.getDay() + 6) % 7] || '';
}

function formatShortDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return `${shortWeekNames[(date.getDay() + 6) % 7]} ${date.getMonth() + 1}/${date.getDate()}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
