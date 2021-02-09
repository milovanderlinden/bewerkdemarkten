import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { Link } from "react-router-dom"

export default class MarketListItem extends Component<{ market: Market, marketId: string }> {
    readonly state: { market: Market } = {
        market: {
            name: "onbekend",
            id: 0,
            //events: {}
        }
    }

    componentDidMount() {
        this.setState({
            market: this.props.market
        })
    }

    render() {
        const { marketId } = this.props
        return <div key={marketId} className={`${this.state.market.phase || "onbekend"} market-card`}>
            <Link to={{
                pathname: `/market/${marketId}`
            }}>

                <h2 style={{ fontWeight: "bold", fontSize: "1.2em" }}>{marketId} </h2>
            </Link>
            <p style={{ color: "rgba(0, 0, 0, 0.45)" }}> {this.state.market.name || ""}</p>
            <p><span  style={{ color: "rgba(0, 0, 0, 0.45)" }}>fase:</span> {this.state.market.phase || " "}</p>
            {/* {this.state.market && <>{Object.keys(this.state.market.events).map((key: string) => {
                    if(this.state.market.events[key].weekday){
                        return <div key={key}>{key}</div>
                    }
                    return <div key={key}>{key}*</div>
                })}</>} */}


        </div>
    }
}