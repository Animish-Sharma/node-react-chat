import './App.scss';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Router/ProtectedRoute';
import Chat from './components/Chat/Chat';
import Register from './components/Auth/Register';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSmile,faImage } from '@fortawesome/free-regular-svg-icons';
import { faSpinner,faEllipsisV,faUserPlus,faSignOutAlt,faTrash,faCaretDown,faUpload,faTimes,faBell } from "@fortawesome/free-solid-svg-icons";
library.add(faSmile,faImage,faSpinner,faEllipsisV,faUserPlus,faSignOutAlt,faTrash,faCaretDown,faUpload,faTimes,faBell)
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <ProtectedRoute exact path="/" component={Chat}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Route render={() => <h1>404 Page Not Found</h1>}/>
        </Switch>
      
      </div>
    </Router>
  );
}

export default App;
