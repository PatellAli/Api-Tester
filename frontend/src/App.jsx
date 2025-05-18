import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { WorkPage } from './pages/WorkPage'
import { Navbar } from './components/Navbar'


function App() {
  return (
    <>
      <Box minH={"100vh"} > 
        <Navbar/>
          <Routes>
              <Route path='/' element={<WorkPage/>}/>
          </Routes>
      </Box>
    </>
  )
}

export default App
