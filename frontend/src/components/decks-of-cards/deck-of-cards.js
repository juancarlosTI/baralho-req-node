import { useState, useEffect } from 'react'
import './deck-of-cards.css'

async function createDeck() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
    const deck = await response.json();
    return deck.deck_id
}

async function getCard(deckId) {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
    return await response.json()
}

const CardsList = (props) => {
    return (
        <ul className='requested-cards'>
            {
                props.cards.map((card) => {
                    return (
                        <li key={card.image}>
                            <img key={card.image} src={card.image} alt={card.value}></img>
                        </li>
                    )
                })
            }
        </ul>
    )
}

const SavedCardsList = (props) => {
    return (
        <ul className='saved-cards'>
            {
                props.cards.map((card) => {
                    return (
                        <>
                            <li key={card.code}>
                                <img key={card.code} src={card.image} alt={card.value} />
                            </li>
                        </>
                    )
                })
            }
        </ul>
    )
}





const DeckOfCards = () => {

    const [deckAtual, setDeckAtual] = useState({
        deck_atual: String()
    })

    const [deck, setDeck] = useState({
        requested_cards: []
    })

    const [savedDeck, setSavedDeck] = useState({
        saved_cards: []
    })

    useEffect(() => {
        const fetchData = async () => {
            const deckId = await createDeck()
            const data = await getCard(deckId)

            setDeck({
                requested_cards: data.cards
            })

            setDeckAtual({
                deck_atual: deckId
            })
        }
        fetchData()
    }, [])

    const postCard = async () => {
        console.log(deck.requested_cards[0])
        const salvarCard = await fetch('http://localhost:3001/save-card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url_image: deck.requested_cards[0].image,
                code: deck.requested_cards[0].code
            })
        });
        return await salvarCard.json();
    }

    const fetchSavedCards = async () => {
        const response = await fetch('http://localhost:3001/saved-cards')
        const savedCards = await response.json();

        const arrayImages = []
        savedCards.forEach(card => {
            arrayImages.push(card.url_image)
        });

        setSavedDeck({
            saved_cards: [...savedDeck.saved_cards,arrayImages]
        })

        console.log(savedDeck.saved_cards)

    }

    return (
        <>
            <section className='main-deck'>
                {deck.requested_cards.length > 0 ? <CardsList cards={deck.requested_cards} /> : "Nenhuma carta exibida"}
                {savedDeck.saved_cards.length > 0 ? <SavedCardsList cards={savedDeck.saved_cards} /> : " / Nenhuma carta salva"}
            </section>
            <section className='btns'>
                <button className='btn-pick-a-card' value='Pick a card' onClick={() => {
                    const fetchCards = async () => {
                        const cards = await getCard(deckAtual.deck_atual)

                        console.log(cards)
                        setDeck({
                            requested_cards: cards.cards
                        })
                    }
                    fetchCards()
                }
                }
                >Pick a card</button>
                <button className='btn-save-a-card' value='Save a card' onClick={() => {
                    postCard().then(() => fetchSavedCards())

                }}
                >Save a card</button>
            </section>
        </>


    )
}


export default DeckOfCards
