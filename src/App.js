//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit, MdDeleteOutline } from 'react-icons/ai';
import { VscCheck } from "react-icons/vsc";


function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [addNewTitle, setAddNewTitle] = useState("");
  const [addNewDescription, setAddNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditItem, setCurrentEditItem] = useState("");

  const handleAddTodoItem = async()=>{
    let newTodoItem={
      title:addNewTitle,
      description:addNewDescription
    }
    let todoUpdatedArray = [...allTodos];
    todoUpdatedArray.push(newTodoItem);
    setAllTodos(todoUpdatedArray);
    localStorage.setItem('todoList', JSON.stringify(todoUpdatedArray));

  }

  const handleDeleteTodo = (index)=>{
    let deleteTodo = [...allTodos];
    deleteTodo.splice(index,1);

    localStorage.setItem('todoList',JSON.stringify(deleteTodo));
    setAllTodos(deleteTodo);
  }

  const handleCompleteTodos = (index)=>{
    let now = new Date();
    let dd = now.getDay();
    let mm = now.getMonth()+1;
    let yyyy = now.getFullYear();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let completedTodoOn = `${dd}-${mm}-${yyyy} at ${hours}:${minutes}:${seconds}`;

    let filteredItems = {...allTodos[index],
      completedTodoOn:completedTodoOn
      
    }

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push (filteredItems);
    setCompletedTodos (updatedCompletedArr);
    handleDeleteTodo (index);
    localStorage.setItem (
      'completedTodos',
      JSON.stringify (updatedCompletedArr)
    );
  };
  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice (index,1);

    localStorage.setItem ('completedTodos', JSON.stringify (reducedTodo));
    setCompletedTodos (reducedTodo);
  };


  useEffect(() => {
    const getSafelyParsedItem = (key) => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage:`, error);
          return [];
        }
      }
      return [];
    };
  
    setAllTodos(getSafelyParsedItem('todoList'));
    setCompletedTodos(getSafelyParsedItem('completedTodos'));
  }, []);
  const handleEdit = (ind,item)=>{
    console.log(ind);
    setCurrentEdit(ind)
    setCurrentEditItem(item);
  }

  const handleUpdatedTitle = (value)=>{
  setCurrentEditItem((prev)=>{
  return {...prev,title:value}
  })

  }

  const handleUpdateDescription = (value)=>{
    setCurrentEditItem((prev)=>{
      return {...prev, description:value}
    })
  }

  const handleUpdateTodo = ()=>{
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditItem;
    setAllTodos(newToDo);
    setCurrentEdit("");
    
  }


  return (
    <div className="App">
      <h1>My To Do List</h1>

      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input-item'>
            <label>Title</label>
            <input type="text" value={addNewTitle} onChange={(e)=>setAddNewTitle(e.target.value)} placeholder="What is your task title?" />
          </div>
          <div className='todo-input-item'>
            <label>Description</label>
            <input type="text" value={addNewDescription} onChange={(e)=>setAddNewDescription(e.target.value)} placeholder="What is your task description?" />
          </div>
          <div className='todo-input-item'>
            <button type='button' onClick={handleAddTodoItem} className='primaryBtn'>Add Task</button>
          </div>
        </div>


        <div className='button-area'>
          <button
            className={`secondaryButton ${isCompleteScreen === false && 'active'}`}

            onClick={() => setIsCompleteScreen(false)}
          >ToDo
          </button>
          <button
            className={`secondaryButton ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >Task Completed
          </button>
        </div>

        <div className='todo-list'>
          {isCompleteScreen=== false && allTodos.map((item,index)=>{
           if(currentEdit === index) {
            return(
            <div className='edit-wrapper' key = {index} >
              <input placeholder='Updated Title'
               onChange = {(e)=>handleUpdatedTitle(e.target.value)}
              value={currentEditItem.title} />
              <textarea placeholder='Update Title'
              rows={4}
              onChange={(e)=>handleUpdateDescription(e.target.value)}
              value={currentEditItem.description}/>
              <button
              type='button'
              onClick={handleUpdateTodo}
              className='primaryButton'>
                Update
              </button>
              </div>
            )
           }else{
            return(
              <div className='todo-list-item' key={item}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

            <div>
              <VscCheck
                className='check-icon' onClick={()=>handleCompleteTodos(index)}
                title='Complete?'
              />
              <AiOutlineDelete
                className='icon' onClick ={()=>handleDeleteTodo(index)}
                title='Delete?'
              />
              <AiOutlineEdit 
              className='check-icon' onClick ={()=>handleEdit(index,item)}
              title='Edit?' />
            </div>

          </div>
            );

           }
           
          })}

{isCompleteScreen=== true && completedTodos.map((item,index)=>{
            return(
              <div className='todo-list-item' key={item}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p><small>Completed on: {item.completedTodoOn}</small></p>
            </div>

            <div>
           
              <AiOutlineDelete
                className='icon' onClick ={()=>handleDeleteCompletedTodo(index)}
                title='Delete?'
              />
            </div>

          </div>
            )
          })}

         
        </div>

      </div>

    </div>


  );
}

export default App;
