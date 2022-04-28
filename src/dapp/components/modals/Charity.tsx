import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { useService } from "@xstate/react";
import {
  service,
  Context,
  BlockchainEvent,
  BlockchainState,
} from "../../machine";

import { Charity as Charities, Donation } from "../../types/contract";

import questionMark from "../../images/ui/expression_confused.png";

import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

import arrowUp from "../../images/ui/arrow_up.png";
import arrowDown from "../../images/ui/arrow_down.png";
import "./Charity.css";

interface Props {
  onSelect: (donation: Donation) => void;
}

export const Charity: React.FC<Props> = ({ onSelect }) => {
  const [machineState] = useService<Context, BlockchainEvent, BlockchainState>(
    service
  );

  const [balances, setBalances] = React.useState({
    coolEarthBalance: "",
    waterBalance: "",
    heiferBalance: "",
  });

  const [donation, setDonation] = React.useState<number>(0.3);

  React.useEffect(() => {
    if (machineState.context.blockChain.isConnected) {
      const load = async () => {
        const balances =
          await machineState.context.blockChain.getCharityBalances();
        setBalances(balances);
      };
      load();
    }
  }, [
    machineState.context.blockChain,
    machineState.context.blockChain.isConnected,
  ]);

  const roundToOneDecimal = (number) => Math.round(number * 10) / 10;

  const handleDonationChange = (event) => {
    setDonation(roundToOneDecimal(event.currentTarget.value));
  };

  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.1) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  return (
    <Panel>
      <div id="charity-container">
        <span>Welcome new player</span>
        <span id="donate-description">
          Create a farm and start earning $FFF tokens and minting NFTs!
        </span>
        {/*<div id="donation-input-container">
          <input
            type="number"
            step="0.1"
            id="donation-input"
            min={0.1}
            value={donation}
            onChange={handleDonationChange}
          />
          <div id="arrow-container">
            <img
              className="arrow"
              alt="Step up donation value"
              src={arrowUp}
              onClick={incrementDonation}
            />
            <img
              className="arrow"
              alt="Step down donation value"
              src={arrowDown}
              onClick={decrementDonation}
            />
          </div>
  </div>*/}
<br></br>
<div className="play-earn">
        <Button
                onClick={() =>
                  onSelect({
                    charity: Charities.TheWaterProject,
                    value: donation.toString(),
                  })
                }
              >
                Play
              </Button>
  </div>
      </div>
    </Panel>
  );
};
