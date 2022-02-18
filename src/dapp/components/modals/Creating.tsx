import React from 'react'
import { Panel } from '../ui/Panel'

import person from '../../images/characters/mining_person.gif'
import tool from '../../images/characters/mining_tool.gif'
import rock from '../../images/characters/mining_rock.png'

export const Creating: React.FC = () => (
    <Panel>
        <div id="saving">
            Creating...

            <h6>Servers are working hard to create your farm</h6>

            <div id='mining-animation'>
                <img id='mining-gif' src={person} />
                <img id='mining-gif' src={tool} />
                <img id='mining-rock' src={rock} />
                
            </div>

        </div>
    </Panel>
)
