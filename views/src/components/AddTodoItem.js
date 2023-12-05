import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";

const AddToDoItem = (props) => {
    const [itemText, setItemText] = useState("");
    const [startDate, setStartDate] = useState(new Date());

    const addItem = async (e) => {
        e.preventDefault();
        try {
          if (itemText.length === 0) {
            alert("Please enter value for your task");
          } else if (startDate == null) {
            alert("Please enter date assigned to the task");
          } else {
            let formattedDate = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
            console.log(formattedDate);
            const res = await axios.post("http://localhost:3001/todos", { item: itemText, date: formattedDate, email: props.user });
            const current = new Date();
            if (current.getTime() < startDate.getTime()) {
                props.setListItemsup((prev) => [...prev, res.data]);
            } else {
                props.setListItems((prev) => [...prev, res.data]);
            }
            setItemText("");
            setStartDate("")
          }
        } catch (err) {
          console.log(err);
        }
    };

    return(
    <form className="form" onSubmit={(e) => addItem(e)}>
        <label for="todo-task"> Task</label>
        <input type="text" id="todo-task" placeholder="Add Todo Item" onChange={(e) => { setItemText(e.target.value);}}
            value={itemText} />
        <label for="date-todo"> Date: </label>
        <DatePicker id="date-todo" format="MM-dd-y" selected={startDate} onChange={(date) => setStartDate(date)}
            isClearable popperClassName="some-custom-class" minDate={new Date()} popperPlacement="top-end"
            popperModifiers={[ { name: "offset", options: { offset: [5, 10], }, }, { name: "preventOverflow",
            options: { rootBoundary: "viewport", tether: false, altAxis: true, }, }, ]}
        />
        <button type="submit">Add</button>
    </form>);
}

export default AddToDoItem;