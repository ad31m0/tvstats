import {PairsSelector} from "/imports/PairsSelector/PairsSelector";
import {TimeframeSelector} from "/imports/TimeframeSelector/TimeframeSelector";
import {Link} from "react-router-dom";

Navbar({

  render(){
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">TV-Rank</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
              <Link className="nav-item nav-link" to="/">Home</Link>
          </li>
          <li class="nav-item">
            <Link className="nav-item nav-link"  to="/traders">Traders</Link>

          </li>
          <li class="nav-item">
          <Link className="nav-item nav-link"  to="/ideas">Ideas</Link>

          </li>

        </ul>
        <form class="form-inline my-2 my-lg-0">
          <TimeframeSelector klass="form-control mr-sm-2" />
        </form>
      </div>
    </nav>
  }
});
