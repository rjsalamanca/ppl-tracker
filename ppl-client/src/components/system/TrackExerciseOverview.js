import React, { useState } from 'react';

import { VictoryChart, VictoryVoronoiContainer, VictoryTooltip, VictoryLabel, VictoryAxis, VictoryHistogram } from 'victory';
import { Card, Container } from 'react-bootstrap';

import histogramStyle from './css/histogramStyle.css';
import basketballData from './basketball-data';
import Slider from "./slider";

const LIGHT_GREY = "hsl(355, 20%, 90%)";
const PRIMARY_COLOR = "hsl(355, 92%, 67%)";


const yearToSeason = year => `${year}-${(year + 1 + "").slice(2, 4)}`;

const YEARS = Object.keys(basketballData).map(year => parseInt(year, 10));
const FIRST_YEAR = YEARS[0];
const LAST_YEAR = YEARS[YEARS.length - 1];
const TOTAL_YEARS = LAST_YEAR - FIRST_YEAR;

const getTooltipText = ({ datum }) => {
   const { binnedData, x0, x1 } = datum;

   const playerCount = binnedData.length;

   if (!playerCount) {
      return null;
   }

   const playerNames = binnedData
      .slice(0, 2)
      .map(({ player }) => {
         const [firstName, lastName] = player.split(" ");
         return lastName ? `${firstName.slice(0, 1)}. ${lastName}` : firstName;
      })
      .join(", ");

   const playerNamesList = `\n (${playerNames}${playerCount > 2 ? `, and ${playerCount - 2} more players` : ""
      })`;

   return `${playerCount} player${playerCount === 1 ? "" : "s"
      } averaged between ${x0}-${x1} 3PT attempts ${playerNamesList}`;
};

const sharedAxisStyles = {
   axis: {
      stroke: "transparent"
   },
   tickLabels: {
      fill: LIGHT_GREY,
      fontSize: 8
   },
   axisLabel: {
      fill: LIGHT_GREY,
      padding: 30,
      fontSize: 10,
      fontStyle: "italic"
   }
};

const getYear = percent =>
   Math.round(FIRST_YEAR + TOTAL_YEARS * (percent / 100));

const SEASONS = YEARS.map(year => yearToSeason(year));

const YearSlider = ({ year, setYear }) => {
   const [value, setValue] = React.useState(0);

   return (
      <>
         <Slider
            onChange={newValue => {
               setValue(newValue);
               const calculatedYear = getYear(newValue);

               if (year !== calculatedYear) {
                  setYear(calculatedYear);
               }
            }}
            color={PRIMARY_COLOR}
            value={value}
            maxValue={100}
            tooltipValues={SEASONS}
         />
      </>
   );
};


function TrackExerciseOverview({ exercise }) {
   const [year, setYear] = useState(FIRST_YEAR);
   return (
      <div>
         {exercise.selected.sets === null
            ? 'No sets have been completed'
            :
            <Container>
               <svg className="svgContainer">
                  <defs>
                     <linearGradient id="gradient1" x1="0%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#FFE29F" />
                        <stop offset="40%" stopColor="#FFA99F" />
                        <stop offset="100%" stopColor={PRIMARY_COLOR} />
                     </linearGradient>
                  </defs>
               </svg>

               <Card className='histogram_slider'>
                  <VictoryChart
                     containerComponent={
                        <VictoryVoronoiContainer
                           // labels={getTooltipText}
                           voronoiDimension="x"
                           labelComponent={
                              <VictoryTooltip
                                 className="test"

                                 constrainToVisibleArea
                                 style={{
                                    fill: LIGHT_GREY,
                                    fontSize: 10
                                 }}
                                 flyoutStyle={{
                                    fill: "#24232a",
                                    stroke: PRIMARY_COLOR,
                                    strokeWidth: 0.5
                                 }}
                              />
                           }
                        />
                     }
                     height={175}
                  >
                     <VictoryLabel
                        text={`3pt Attempts Per Game Averages (${yearToSeason(year)})`}
                        x={225}
                        y={18}
                        textAnchor="middle"
                        style={{ fill: LIGHT_GREY, fontSize: 12 }}
                     />
                     <VictoryAxis
                        style={{
                           ...sharedAxisStyles,
                           grid: {
                              fill: LIGHT_GREY,
                              stroke: LIGHT_GREY,
                              pointerEvents: "painted",
                              strokeWidth: 0.5
                           }
                        }}
                        label="Volume"
                        dependentAxis
                     />
                     <VictoryAxis
                        style={{
                           ...sharedAxisStyles,
                           axisLabel: { ...sharedAxisStyles.axisLabel, padding: 20 }
                        }}
                        label="Date"
                     />
                     <VictoryHistogram
                        cornerRadius={2}
                        domain={{ y: [0, 125] }}
                        animate={{ duration: 300 }}
                        data={basketballData[year]}
                        // bins={_.range(0, 16, 2)}
                        style={{
                           data: {
                              stroke: "transparent",
                              fill: "url(#gradient1)",
                              strokeWidth: 1,
                           },
                           labels: {
                              fill: "red"
                           }
                        }}
                        x="3pa"
                     />
                  </VictoryChart>

                  <YearSlider year={year} setYear={setYear} />
               </Card>
            </Container>
         }
      </div>
   );
}

export default TrackExerciseOverview;