import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { VictoryChart, VictoryZoomContainer, VictoryTooltip, VictoryGroup, VictoryAxis, VictoryBrushContainer, VictoryBar } from 'victory';

import './css/histogramStyle.css';

function TrackExerciseOverview({ exercise }) {
   const [zoomDomain, setZoomDomain] = useState({ x: [moment().subtract(7, 'd'), moment()] });
   const [buildGraph1, setBuildGraph1] = useState([]);
   const [buildGraph2, setBuildGraph2] = useState([]);

   useEffect(() => {
      if (buildGraph1.length === 0) generateGraph();
   }, []);

   const handleZoom = (domain) => {
      setZoomDomain(domain);
   }

   const generateGraph = () => {
      let tempBuildGraph2 = [];
      const tempBuildGraph1 = exercise.selected.sets.map(set => set.set_date).filter((date, i, array) => array.indexOf(date) === i).map(date => {
         const volume = exercise.selected.sets.filter(set => set.set_date === date).map(set => set.weight * set.reps).reduce((a, b) => a + b);
         tempBuildGraph2.push({ key: moment(date), b: volume })
         return { a: moment(date), b: volume }
      });

      setBuildGraph1(tempBuildGraph1);
      setBuildGraph2(tempBuildGraph2);
   }

   const victoryLabelFormat = (info) => `Date: ${(info.a).format('MMM, DD, YYYY')}\nTotal Volume: ${info.b}lbs`;

   return (
      <div>
         {exercise.selected.sets === null
            ? 'No sets have been completed'
            :
            <div className="chart-container" style={{ width: '80%', margin: '0 auto' }}>
               <h2 className="d-flex justify-content-center">{`Total ${exercise.selected.name} Volume`}</h2>
               <VictoryChart
                  domain={{ y: [0, 10000] }}
                  domainPadding={{ y: [20, 20], x: [20, 20] }}
                  padding={{ top: 0, bottom: 50, left: 70, right: 50 }}
                  width={600}
                  height={250}
                  scale={{ x: "time" }}
                  containerComponent={
                     <VictoryZoomContainer
                        zoomDimension="x"
                        zoomDomain={zoomDomain}
                        onZoomDomainChange={handleZoom.bind(this)}
                     />
                  }
               >
                  <VictoryAxis tickFormat={(x) => moment(x).format('MMM DD, YY')} />
                  <VictoryAxis
                     dependentAxis
                     style={{
                        axisLabel: { fontSize: 10, padding: 60 },

                     }}

                     label='Volume'
                  />

                  <VictoryGroup color="#006edc">
                     <VictoryBar
                        labels={({ datum }) => victoryLabelFormat(datum)}
                        labelComponent={
                           < VictoryTooltip
                              style={{ fontSize: 10 }
                              }
                           />
                        }
                        data={buildGraph1}
                        x="a"
                        y="b"
                     />
                  </VictoryGroup>
               </VictoryChart>
               <VictoryChart
                  domainPadding={{ y: [20, 20], x: [20, 20] }}
                  padding={{ top: 0, bottom: 30, left: 0, right: 0 }}
                  width={600}
                  height={50}
                  scale={{ x: "time" }}
                  containerComponent={
                     <VictoryBrushContainer
                        brushDimension="x"
                        brushDomain={zoomDomain}
                        onBrushDomainChange={handleZoom.bind(this)}
                     />
                  }
               >
                  <VictoryAxis tickFormat={(x) => moment(x).format('MMM DD, YY')} />

                  <VictoryGroup color="#006edc" >
                     <VictoryBar
                        data={buildGraph2}
                        x="key"
                        y="b"
                     />
                  </VictoryGroup>
               </VictoryChart>
            </div>
         }
      </div>
   );
}

export default TrackExerciseOverview;