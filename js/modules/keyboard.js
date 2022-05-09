class Keyboard {
  constructor(keysLayout, placeNode = null) {
    this.parentNode = placeNode;
    this.elements = {
      main: null,
      keyboardWrapper: null,
      display: null,
      keysContainer: null,
      keys: [],
    };
    this.eventHandlers = {
      onInput: null,
      onClose: null,
    };
    this.properties = {
      value: "",
      isCapsLock: false,
      lang: "RU",
    };
    this.keysLayout = [...keysLayout];
  }

  initPage() {
    // create page elements
    this.elements.main = document.createElement("main");
    const header = document.createElement("header");
    const footer = document.createElement("footer");
    const headerTitle = document.createElement("h1");

    // setup page elements
    this.elements.main.classList.add("container");
    footer.classList.add("footer");
    headerTitle.classList.add("header-title");
    headerTitle.append("Virtual Keyboard (RS School Task)");

    // add to DOM
    header.append(headerTitle);
    document.body.append(header, this.elements.main, footer);
  }

  initKeyboard() {
    // create elements
    this.elements.keyboardWrapper = document.createElement("div");
    const displayWrapper = document.createElement("div");
    this.elements.display = document.createElement("pre");
    this.elements.keysContainer = document.createElement("div");

    // setup elements
    this.elements.keyboardWrapper.classList.add("keyboard-wrapper");
    this.elements.keyboardWrapper.id = "keyboard-wrapper";
    displayWrapper.classList.add("display-wrapper");
    this.elements.display.classList.add("display-text");
    this.elements.display.id = "display-text";
    this.elements.keysContainer.classList.add("keyboard");
    this.elements.keysContainer.id = "keyboard";

    // add to DOM
    displayWrapper.append(this.elements.display);
    this.elements.keyboardWrapper.append(
      displayWrapper,
      this.elements.keysContainer
    );

    // this.elements.keysContainer.append();
    if (!this.parentNode) {
      this.elements.main.append(this.elements.keyboardWrapper);
    } else {
      this.parentNode.append(this.elements.keyboardWrapper);
    }
  }

  _createKeys() {
    // this.keysLayout.forEach((key) => {
    //   console.log(key);
    // });
    const keysFragment = document.createDocumentFragment();
    let arrowsBlockElement = null;

    // create icon function
    const createIconHTML = (icon_name) => {
      return `<span class="material-symbols-outlined key__icon">
      ${icon_name}
    </span>`;
    };
    // create key text function
    const createKeyTextHTML = (key_text) => {
      return `<span class="key__text">
      ${key_text}
    </span>`;
    };
    // create indicator function
    const createIndicatorHTML = () => {
      return `<span class="key__indicator">
    </span>`;
    };
    // create arrow block function
    const createArrowsBlockHTML = () => {
      const newNode = document.createElement("span");
      newNode.classList.add("arrows-block");
      newNode.innerHTML = `
        <span class="arrows__row arrows__row--top"></span>
        <span class="arrows__row arrows__row--bottom"></span>
      `;
      return newNode;
    };
    // ======================================

    // count number of rows
    const rowArray = this.keysLayout.map((item) => {
      return item.keyRow;
    });
    const rowCount = Math.max(...rowArray);
    console.log(rowCount);

    // create rows
    for (let i = 1; i <= rowCount; i++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("keyboard__row");
      keysFragment.append(rowElement);
    }

    // create keys
    this.keysLayout.forEach((key) => {
      const keyElement = document.createElement("span");
      keyElement.classList.add("keyboard__key");

      if (
        key.isOptionKey &&
        !key.optionName.includes("arrow") &&
        !key.optionName.includes("help")
      ) {
        keyElement.classList.add("key--hotkey");

        switch (key.optionName) {
          case "backspace": {
            keyElement.classList.add("key--backspace");
            keyElement.innerHTML =
              createKeyTextHTML("backspace") + createIconHTML("backspace");
            break;
          }
          case "tab": {
            keyElement.classList.add("key--tab");
            keyElement.innerHTML = "tab";
            break;
          }
          case "del": {
            keyElement.classList.add("key--del");
            keyElement.innerHTML = "del";
            break;
          }
          case "caps lock": {
            keyElement.classList.add("key--capslock");
            keyElement.innerHTML =
              createKeyTextHTML("caps lock") + createIndicatorHTML();
            break;
          }
          case "return": {
            keyElement.classList.add("key--return");
            keyElement.innerHTML = "return";
            break;
          }
          case "shift left": {
            keyElement.classList.add("key--shift", "key--shift-left");
            keyElement.innerHTML = "shift";
            break;
          }
          case "shift right": {
            keyElement.classList.add("key--shift", "key--shift-right");
            keyElement.innerHTML = "shift";
            break;
          }
          case "control": {
            keyElement.classList.add("key--control");
            keyElement.innerHTML =
              createKeyTextHTML("control") +
              createIconHTML("keyboard_control_key");
            break;
          }
          case "option left": {
            keyElement.classList.add("key--option", "key--option-left");
            keyElement.innerHTML =
              createKeyTextHTML("option") +
              createIconHTML("keyboard_option_key");
            break;
          }
          case "option right": {
            keyElement.classList.add("key--option", "key--option-right");
            keyElement.innerHTML =
              createKeyTextHTML("option") +
              createIconHTML("keyboard_option_key");
            break;
          }
          case "command left": {
            keyElement.classList.add("key--command", "key--command-left");
            keyElement.innerHTML =
              createKeyTextHTML("command") +
              createIconHTML("keyboard_command_key");
            break;
          }
          case "command right": {
            keyElement.classList.add("key--command", "key--command-right");
            keyElement.innerHTML =
              createKeyTextHTML("command") +
              createIconHTML("keyboard_command_key");
            break;
          }
          case "space": {
            keyElement.classList.add("key--space");
            break;
          }
        }
      } else if (key.isOptionKey && key.optionName.includes("help")) {
        keyElement.classList.add("key--help");
        keyElement.id = "help-key";
        keyElement.innerHTML = createIconHTML("question_mark");
        const footerPage = document.querySelector(".footer");

        keyElement.addEventListener("click", function () {
          if (!keyElement.classList.contains("active")) {
            keyElement.classList.add("active");
            footerPage.classList.add("help-active");
          } else {
            keyElement.classList.remove("active");
            footerPage.classList.remove("help-active");
          }
        });
      } else if (key.isOptionKey && key.optionName.includes("arrow")) {
        switch (key.optionName) {
          case "arrow top": {
            keyElement.classList.add("key--arrow", "key--arrow-top");
            keyElement.innerHTML = "&uarr;";
            break;
          }
          case "arrow left": {
            keyElement.classList.add("key--arrow", "key--arrow-left");
            keyElement.innerHTML = "&larr;";
            break;
          }
          case "arrow bottom": {
            keyElement.classList.add("key--arrow", "key--arrow-bottom");
            keyElement.innerHTML = "&darr;";
            break;
          }
          case "arrow right": {
            keyElement.classList.add("key--arrow", "key--arrow-right");
            keyElement.innerHTML = "&rarr;";
            break;
          }
        }
      }

      // add text (lang) to keys
      if (key.value.ENG) {
        keyElement.append(key.value.ENG);
      }

      // add to row in DOM
      if (key.keyRow === 0) {
        keysFragment.prepend(keyElement);
      } else if (key.isOptionKey && key.optionName.includes("arrow")) {
        if (!arrowsBlockElement) {
          arrowsBlockElement = createArrowsBlockHTML();
          keysFragment.children[key.keyRow - 1].append(arrowsBlockElement);
        }
        if (key.optionName === "arrow top") {
          arrowsBlockElement.children[0].append(keyElement);
        } else {
          arrowsBlockElement.children[1].append(keyElement);
        }
      } else {
        keysFragment.children[key.keyRow - 1].append(keyElement);
      }
    });

    // add fragment to DOM
    this.elements.keysContainer.append(keysFragment);
  }

  _triggerEvents(handlerName) {
    console.log("Event trigerred! Name - ", handlerName);
  }

  _toggleCapsLock() {
    console.log("Caps Lock toggled!");
  }

  // open(initValue, onInput, onClose) {}

  // close() {}
}

export default Keyboard;
