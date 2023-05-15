import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Container,
  Typography,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import axios from 'axios';
import { Add, Delete } from '@mui/icons-material';
import { fontSize } from '@mui/system';
const TodoApp = () => {
  const [todos, setTodos] = useState();
  const [inputValue, setInputValue] = useState('');

  useEffect(()=>{
    fetchData()
  },[])

const fetchData=async()=>
{
   try {
      const response = await axios.get('http://localhost:5500/todos/');
      let data = await response.data
      setTodos(data)
    } catch (error) {
      console.error(error);
    }
}

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async() => {
    if (inputValue.trim()) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { id: Date.now(), title: inputValue },
      ]);
      setInputValue('');
      try {
      await axios.post(`http://localhost:5500/todos/`,{id: Date.now(), title: inputValue});
    } catch (error) {
      console.error(error);
    }
    }
  };

  const handleDeleteTodo = async(id) => {
    try {
      await axios.delete(`http://localhost:5500/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleted=async(id)=>{
        try {
      await axios.put(`http://localhost:5500/todos/${id}`,{completion_status:'done'});
      setTodos((prevTodos) => prevTodos.map((todo) => 
        todo.id === id?{...todo , completion_status:'done'}:todo));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <Container sx={{marginTop:'20px',display:'flex',justifyContent:'center', fontSize:'26px',
  fontWeight:'bold'}}>Simple Todo App</Container>  
    <Container sx={{marginTop:'20px'}}>
      <TextField
        label="Add Todo"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddTodo}
        style={{    padding: '15px', marginLeft: '12px'}}
      >
        Add
      </Button>
      <List>
        {todos?.map((todo) => (
          <ListItem key={todo.id}>
            <ListItemText primary={todo.title} />
            {todo.completion_status==='done' ? (
        <IconButton disabled>
          <DoneIcon color='success' sx={{width:'40px',height:'30px'}}/>
        </IconButton>
      ) : (
        <IconButton onClick={()=>handleCompleted(todo.id)}>
          <DoneIcon sx={{width:'40px',height:'30px'}}/>
        </IconButton>
      )}
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
    </>
  );
};

export default TodoApp;
