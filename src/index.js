import React from "react";
import ReactDOM from "react-dom";
import './index.css';

/**
 * 小格子
 */
class Square extends React.Component{ 
    render(){
        return (
            <button className="square" onClick={()=>{
                this.props.onClick()
            }}>
                {this.props.value}
            </button>
        );
    }
}

/**
 * 格子板
 */
class Board extends React.Component{ 
    renderSquare(i){
        return (
            <Square 
                value={this.props.squares[i]}
                onClick = {()=>{
                    this.props.onClick(i);
                }}
            />
        );
    }    

    render(){ 
        return (
            <div> 
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}  
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}  
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}  
                </div>
            </div>
        );
    }
}

/**
 * 整个游戏的布局
 */
class Game extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            history:[{
                squares:Array(9).fill(null),
            }],
            xIsNext:true,
            stepNumber:0,
        }
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step%2)===0,
        });
    }

    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];         
        const squares = current.squares.slice();   
        if(calculateWinner(squares)||squares[i]){// 如果有人胜出，或者该格子已经有数据
            return;
        }     
        squares[i] = this.state.xIsNext?'X':'O';
        this.setState({
           history:history.concat([{
               squares:squares,
           }]),
           stepNumber:history.length,
           xIsNext:!this.state.xIsNext,
        });
    }

    render(){
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // 历史纪录的li列表
        const moves = history.map((step,move)=>{
            const desc = move?
                'Go to move #'+move:
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={()=>{
                        this.jumpTo(move)
                    }}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'winner:'+winner;
        }else{
            status = "next player:"+(this.state.xIsNext?'X':'O');
        } 


        return (
            <div className="game">                  
                 <div className="game-board">
                    <Board 
                        squares = {current.squares}
                        onClick = {(i) =>this.handleClick(i)}
                    />
                 </div>
                 <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                 </div>
            </div>             
        );
    }
}

/**
 * 
 * @param {计算winner} squares 
 */
function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6] 
    ];
    for(let i = 0;i<lines.length;i++){
        const [a,b,c] = lines[i];// 析构复制，es6新特性
        if(squares[a]&&squares[a] === squares[b] && squares[a] === squares[c]){// 判断三个位置上是否是一样的，就表示胜利
            return squares[a];
        }
    }
    return null;
}


// 渲染
ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

 