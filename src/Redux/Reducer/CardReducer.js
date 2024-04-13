
import { CARDCOUNT } from '../Action/CardAction';

const ini = {
      CardData: 0
}

const CardReducer = (state = ini, action) => {
      switch (action.type) {
            case CARDCOUNT:
                  return {
                        ...state,
                        CardData: action.payload
                  }

            default:
                  return state
      }
}

export default CardReducer