import React from "react";
import { Panel } from "../ui/Panel";

import person from "../../images/characters/crafting.gif";

import "./Saving.css";

export const Crafting: React.FC = () => (
  <Panel>
    <div id="saving">
      <h4>Crafting...</h4>
      <h6>servers are working hard to save your items.</h6>

      <div id="mining-animation">
        <img id="crafting-gif" src={person} />
      </div>

    </div>
  </Panel>
);
