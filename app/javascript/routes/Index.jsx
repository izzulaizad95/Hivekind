import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Analytics from '../components/analytics/Analytics'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Home from '../components/Home'

// export default () => {
//   return (
//     <Router>
//       <Header />
//       <Switch>
//         <Route path="/" exact component={Home} />
//         <Route path="/a/:id" exact component={Analytics} />
//       </Switch>
//       <Footer />
//     </Router>
//   )
// }

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/a/:id" exact component={Analytics} />
      </Switch>
      <Footer />
    </Router>
  )
}

export default Routes
