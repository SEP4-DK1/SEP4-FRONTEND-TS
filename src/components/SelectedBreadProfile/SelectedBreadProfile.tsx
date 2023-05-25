import { useState } from "react";
import "./SelectedBreadProfile.module.css";
import { BreadProfile, target } from "../config";
import styles from "./SelectedBreadProfile.module.css";

export default function SelectedBreadProfile(props: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");

  return (
    <div>
      <div className={styles.container} onBlur={toggleDropdownOff}>
        <input
          type="text"
          placeholder="Search.."
          id="myInput"
          value={inputValue}
          onFocus={toggleDropdownOn}
          onChange={(event) => {
            setInputValue(event.target.value);
            props.setSelectedDate(null);
          }}
        />

        {dropdown()}
        {Buttons()}
      </div>

      {AddWindow()}
      {RemoveWindow()}
      {EditWindow()}

      <div
        className={`${styles.errorContainer} ${styles.hide}`}
        id="errorState"
      >
        <p>{props.errorState}</p>
      </div>
    </div>
  );

  // # CHANGES THE AMOUNT OF THE BUTTONS
  function Buttons() {
    if (CheckIsBreadProfile()) {
      return (
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => {
              props.setSelectedDate({ targets: [{}, {}, {}, {}] });
              props.setshowRemove(false);
              props.setshowEdit(false);
              props.setshowAdd(true);
              setInputValue("");
              setDescription("");
              setTitle("");
            }}
          >
            Add
          </button>

          <button
            className={styles.button}
            onClick={() => {
              props.setshowAdd(false);
              props.setshowEdit(false);
              props.setshowRemove(true);
            }}
          >
            Remove
          </button>

          <button
            className={styles.button}
            onClick={() => {
              props.setshowAdd(false);
              props.setshowRemove(false);
              props.setshowEdit(true);
              setDescription(props.SelectedData.description);
              setTitle(props.SelectedData.title);
            }}
          >
            Edit
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={() => {
              props.setSelectedDate({ targets: [{}, {}, {}, {}] });
              props.setshowRemove(false);
              props.setshowEdit(false);
              props.setshowAdd(true);
              setInputValue("");
              setDescription("");
              setTitle("");
            }}
          >
            Add
          </button>
        </div>
      );
    }
  }

  // NOTE: DROP-DOWN
  function dropdown() {
    if (showDropdown) {
      if (props.Data != null) {
        return (
          <div className={styles.dropdown}>
            {props.Data.map((item: BreadProfile, index: number) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onMouseDown={() => HandleClickItem(item)}
              >
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div className={styles.dropdown}>
            <div className={styles.dropdownItem}>
              No Bread Profiles or server down
            </div>
          </div>
        );
      }
    }
  }

  // NOTE: SHOWS THE DIFFERENT WINDOWS
  function AddWindow() {
    if (props.ShowAdd) {
      return (
        <div className={styles.Add}>
          <p>Create a new Profile</p>
          <input
            type="text"
            placeholder="Title"
            value={Title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            placeholder="Description"
            value={Description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                props.setshowAdd(false);
                setTitle("");
                setDescription("");
                hideErrorState();
              }}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                PostProfile();
              }}
              className={styles.confirm}
            >
              Create
            </button>
          </div>
        </div>
      );
    }
    return <></>;
  }

  function EditWindow() {
    if (props.ShowEdit) {
      //take data and set title and description
      return (
        <div className={styles.Edit}>
          <p>Editing Selected Profile</p>
          <input
            type="text"
            placeholder="Title"
            value={Title}
            onChange={(event) => setTitle(event.target.value)}
          ></input>

          <textarea
            placeholder="Description"
            value={Description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                props.setshowEdit(false);
                setTitle("");
                setDescription("");
                hideErrorState();
              }}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                UpdateProfile();
              }}
              className={styles.confirm}
            >
              Save
            </button>
          </div>
        </div>
      );
    }
    return <></>;
  }

  function RemoveWindow() {
    if (props.ShowRemove) {
      return (
        <div className={styles.Remove}>
          <p>Deleting Selected Profile</p>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                props.setshowRemove(false);
              }}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                props.setshowRemove(false);
                DeleteProfile();
              }}
              className={styles.confirm}
            >
              Confirm
            </button>
          </div>
        </div>
      );
    }
    return <></>;
  }

  // # CHECKS IF THE SELECTED PROFILE IN THE DROPDOWN IS DONE
  function CheckIsBreadProfile(): boolean {
    return (
      props.SelectedData !== null && props.SelectedData?.title !== undefined
    );
  }

  // NOTE: METHODS FROM PARENT (PAGE)
  // * Just give the information to the page.
  function UpdateProfile() {
    const breadProfil: BreadProfile = {
      ...props.SelectedData,
      title: Title,
      description: Description,
    };

    if (ValidateBreadProfile(breadProfil)) {
      props.setshowAdd(false);
      props.setshowEdit(false);
      props.UpdateProfil(breadProfil);

      setTitle("");
      setDescription("");
      setInputValue("");

      props.setSelectedDate(null);
    }
  }

  function PostProfile() {
    const breadProfil: BreadProfile = {
      ...props.SelectedData,
      title: Title,
      description: Description,
    };

    if (ValidateBreadProfile(breadProfil)) {
      props.setshowAdd(false);
      props.setSelectedDate({ breadProfil });

      props.PostProfil(breadProfil);

      setTitle("");
      setDescription("");

      props.setSelectedDate(null);
    }
  }

  function DeleteProfile() {
    const breadProfil: BreadProfile = {
      ...props.SelectedData,
    };
    props.DeleteProfil(breadProfil);

    setTitle("");
    setDescription("");
    setInputValue("");

    props.setSelectedDate(null);
  }

  // # MAKE A SHADOW OF THE SELECTED PROFILE
  function HandleClickItem(profile: BreadProfile) {
    props.setshowRemove(false);
    props.setshowEdit(false);
    props.setshowAdd(false);

    let copyOfProfile: BreadProfile = { ...profile, targets: profile.targets };

    if (copyOfProfile.targets === undefined) {
      copyOfProfile = { ...copyOfProfile, targets: [] };
    }

    for (let i = 0; i < 4; i++) {
      if (
        copyOfProfile?.targets?.find(
          (element: target, index: number) => i === index
        ) === null
      ) {
        copyOfProfile = {
          ...copyOfProfile,
          targets: [...copyOfProfile.targets, {}],
        };
      }
    }

    props.setSelectedDate({ ...copyOfProfile });

    setInputValue(profile?.title);

    setDescription("" + copyOfProfile.description);
    setTitle("" + copyOfProfile.title);

    toggleDropdownOff();
  }

  // # USED FOR VALIDATING ONE BREAD-PROFILE
  function ValidateBreadProfile(profile: BreadProfile) {
    if (profile.title === "" || profile.description === "") {
      showErrorState();
      props.setErrorState("There must be an title and description");
      return false;
    }

    let hasFailed: boolean = false;

    profile.targets?.forEach((element) => {
      if (!ValidateTarget(element.temp, element.humidity, element.offset)) {
        hasFailed = true;
        return;
      }
    });

    if (!hasFailed) {
      hideErrorState();
      props.setErrorState("");
    }
    return !hasFailed;
  }

  // # USED FOR VALIDATING TARGETS (USES SUB-FUNCTIONS BELOW)
  function ValidateTarget(
    temperature: string | undefined,
    humidity: string | undefined,
    time: string | undefined
  ) {
    return (
      !validationTemp(temperature) &&
      !validationHumidity(humidity) &&
      !validationTime(time)
    );
  }

  // * Validates the temperature is valid
  function validationTemp(temperature: string | undefined) {
    if (temperature === undefined || temperature === "") {
      showErrorState();
      props.setErrorState("There must be an input in temperature");
      return false;
    }
    if (Number(temperature) > 100 || Number(temperature) < -20) {
      showErrorState();
      props.setErrorState("Temperature must be between -20 and 100");
      return false;
    }
    return true;
  }

  // * Validates the humidity is valid
  function validationHumidity(humidity: string | undefined) {
    if (humidity === undefined || humidity === "") {
      showErrorState();
      props.setErrorState("There must be an input in Humidity");
      return false;
    }
    if (Number(humidity) > 100 || Number(humidity) < 0) {
      showErrorState();
      props.setErrorState("Humidity must be between 0 and 100");
      return false;
    }
    return true;
  }

  // * Validates the time is valid
  function validationTime(time: string | undefined) {
    if (time === undefined || time === "") {
      showErrorState();
      props.setErrorState("There must be an input in Time");
      return false;
    }
    if (time > "24:00:00" || time < "00:00:00") {
      showErrorState();
      props.setErrorState("Time must be between 00:00:00 and 24:00:00");
      return false;
    }

    const Array: string[] = time.split(":");

    if (Array.length != 3) {
      showErrorState();
      props.setErrorState("Time is not the right format");
      return false;
    }

    if (parseInt(Array[0]) > 24 || parseInt(Array[0]) < 0) {
      showErrorState();
      props.setErrorState("Hours must be between 00 and 24");
      return false;
    }

    if (parseInt(Array[1]) > 60 || parseInt(Array[1]) < 0) {
      showErrorState();
      props.setErrorState("Minutes must be between 00 and 60");
      return false;
    }

    if (parseInt(Array[2]) > 60 || parseInt(Array[2]) < 0) {
      showErrorState();
      props.setErrorState("Seconds must be between 00 and 60");
      return false;
    }

    for (let i: number = 0; i < Array.length; i++) {
      if (isNaN(parseInt(Array[i]))) {
        showErrorState();
        props.setErrorState("Not a number");
        return false;
      }
    }

    return true;
  }

  // ! USED TO SHOW/HIDE DROP-DOWN
  function toggleDropdownOn() {
    setShowDropdown(true);
  }

  function toggleDropdownOff() {
    setShowDropdown(false);
  }

  // ! USED TO SHOW/HIDE ERROR-STATE
  function hideErrorState() {
    const element: HTMLElement | null = document.getElementById("errorState");
    element?.classList.add("hide");
  }

  function showErrorState() {
    const element: HTMLElement | null = document.getElementById("errorState");
    element?.classList.remove("hide");
  }
}