import React, { Component } from 'react';

import ehCurves from './ehCurves';

const pkeys = [ 'x1', 'y1', 'x2', 'y2', 'xc1', 'yc1', 'xc2', 'yc2' ];

const pts = ['1', '2', 'c1', 'c2'];
const ptC = { 1: 'green', 2: 'red', c1: 'cyan', c2: 'orange' };

const ratio = 1000 / 442;

class App extends Component {
  state = {
    active: -1,
    dragging: false,
    dragPoint: [],
    
    curves: [
      {
        x1: 20, y1: 20,
        x2: 600, y2: 600,
        xc1: 300, yc1: 400,
        xc2: 400, yc2: 300,
      },
    ],
  }

  setActive = (ci)=>{
    this.setState({ active: ci });
  }

  dragStart = (pt)=> ({ pageX, pageY })=>{
    this.setState({ dragging: pt, dragPoint: [pageX, pageY] });
  }

  drag = ({ pageX, pageY })=>{
    if( this.state.dragging !== false ) {
      this.setState(state => ({
        ...state,
        curves: state.curves.map((cc, cci)=>
          (cci !== this.state.active ) ? cc : ({
            ...cc,
            ['x'+this.state.dragging]: (
              ratio * (pageX - state.dragPoint[0]) +
              state.curves[ state.active ][ 'x'+state.dragging ]
            ),
            ['y'+this.state.dragging]: (
              ratio * (pageY - state.dragPoint[1]) +
              state.curves[ state.active ][ 'y'+state.dragging ]
            ),
          })
        ),
        dragPoint: [ pageX, pageY ],
      }));


    }
  }

  dragEnd = ()=>{
    this.setState({ dragging: false });
  }
  
  
  setPoint = (ci, pi, val)=>{
    this.setState(state => ({
      ...state,
      curves: state.curves.map((cc, cci)=>
        (cci !== ci ) ? cc : ({ ...cc, [pi]: val })
      ),
    }));
  }
  
  nuCurve = ()=>{
    this.setState(state => ({
      ...state,
      curves: state.curves.concat({
        x1: 20, y1: 120,
        x2: 160, y2: 60,
        xc1: 30, yc1: 140,
        xc2: 140, yc2: 30,
      }),
      active: state.curves.length,
    }));
  }

  save = ()=>{
    localStorage.curves = JSON.stringify( this.state.curves );
  }

  load = ()=>{
    let curves = [];
    try{
      curves = JSON.parse( localStorage.curves );
    }catch(e){
      localStorage.curves = [];
    }
    
    this.setState({ curves, active: -1 });
  }

  sayEh = ()=>{
    this.setState({ curves: ehCurves });
  }
  
  render() {

    const path = ({ x1, y1, xc1, yc1, xc2, yc2, x2, y2 })=>
      `M ${x1} ${y1} C ${xc1} ${yc1}, ${xc2} ${yc2}, ${x2} ${y2}`;

    const orderedPts = !this.state.dragging ? pts : pts.sort((a, b)=>
      a === this.state.dragging ? 1 : (
        b === this.state.dragging ? -1 : 0
      )
    );
    
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>

        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"
             onDoubleClick={this.sayEh}
             style={{ height: '98vh', width: '70vw' }}>
          <g>
            {
              this.state.curves.map((cc, cci)=> (
                <path d={path(cc)}
                      stroke="black" strokeWidth="3"
                      fill="transparent"
                      onClick={()=> this.setActive(cci)}
                      key={cci}/>
              ) )
            }
          </g>
          
          {
            this.state.active === -1 ? null : orderedPts.map(pt=> (
              <g key={pt+this.state.active}
                 onMouseLeave={this.dragEnd}>
                {
                  (this.state.dragging === pt) ?
                  <circle cx={this.state.curves[this.state.active]['x'+pt]}
                          cy={this.state.curves[this.state.active]['y'+pt]}
                          onMouseMove={this.drag}
                          onMouseUp={this.dragEnd}
                          r="90" fill="transparent"/> : null
                }
                  <circle cx={this.state.curves[this.state.active]['x'+pt]}
                          cy={this.state.curves[this.state.active]['y'+pt]}
                          onMouseDown={this.dragStart(pt)}
                          onMouseMove={this.drag}
                          onMouseUp={this.dragEnd}
                          r="12" fill={ptC[pt]}
                          id={pt+this.state.active}/>
              </g>
            ) )
          }
        </svg>

        <div style={{
          height: '98vh', width: '25vw', border: '1px solid red',
          display: 'flex', flexDirection: 'column'
        }}>
          <button onClick={this.save}>save</button>
          <button onClick={this.load}>load</button>
          <button onClick={this.nuCurve}>+</button>
          {
            this.state.curves.map((c, i)=> (
              <div key={i} style={{
                display: 'flex', flexWrap: 'wrap',
                marginBottom: 10, borderBottom: '2px dashed black',
              }}>
                {
                  pkeys.map(p=>(
                    <div key={p+i} style={{ width: 50, padding: 2 }}>
                      <div style={{ border: '1px solid '+ptC[p.slice(1)] }} >
                        {p}
                      </div>
                      <input value={this.state.curves[i][p]}
                             type="number" step="10"
                             style={{ width: 40 }}
                             onChange={e=>
                               this.setPoint(i, p, e.target.value)}/>
                    </div>
                  ) )
                }
              </div>
            ) )
          }
        </div>

      </div>
    );
  }
}

export default App;
