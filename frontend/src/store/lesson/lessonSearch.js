import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type : 'all',
  order : "title",
  deadline : false,
  category : [],
  keyword : ""
}

const lessonSearch = createSlice({
  name : 'lessonSearch',
  initialState,
  reducers : {
    setOrder : (state, action) => {
      state.order = action.payload
    },
    setDeadLine : (state, action) => {
      state.deadline = action.payload
    },
    setCategories : (state, action) => {
      state.category = action.payload
    },
    setKeyword : (state, action) => {
      state.keyword = action.payload
    },
    setType : (state, action) => {
      state.type = action.payload
    }
  }
})

export const {
  setOrder, setDeadLine, setCategories, setKeyword, setType
} = lessonSearch.actions
export default lessonSearch.reducer