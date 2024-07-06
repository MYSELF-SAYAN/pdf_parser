import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
// interface pdfState {
//     title: string;
//     fileurl: string;
//     filedata: string;
// }
interface userState {
  id: string;
  email: string;
  username: string;
isLogged: boolean;
  
}

// Define the initial state using that type
const initialState: userState = {
    id: "",
    email: "",
    username: "",
    isLogged: false,
    
};

export const userSlice = createSlice({
  name: "user",
  
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<userState>) => {
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.isLogged = true;
        
    },
    logOut: (state) => {
        state.id = "";
        state.email = "";
        state.username = "";
        state.isLogged = false;
      
    }
  },
});

export const { signIn,logOut } = userSlice.actions;

export default userSlice.reducer;