import update from 'immutability-helper'
import { FC, ReactNode, useEffect, useRef } from 'react'
import { useCallback, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { Identifier, XYCoord } from 'dnd-core'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface CardProps<T extends ReactNode> {
  id: any
  item: T
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export function Card<T extends ReactNode>(props: CardProps<T>) {
  const { id, item, index, moveCard } = props
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {item}
    </div>
  )
}

export interface Item {
  id: number
  item: ReactNode
}

export interface SortListProps<T> {
  items: Item[]
}

export function SortableList<T extends ReactNode>(props: SortListProps<T>) {
  {
    const { items } = props
    const [cards, setCards] = useState(items)
    useEffect(() => {
      setCards(props.items)
    }, [props.items])
    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: Item[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Item],
          ],
        })
      )
    }, [])

    const renderCard = useCallback(
      (card: { id: number; item: ReactNode }, index: number) => {
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            item={card.item}
            moveCard={moveCard}
          />
        )
      },
      []
    )

    return (
      <>
        <DndProvider backend={HTML5Backend}>
          <div>{cards.map((card, i) => renderCard(card, i))}</div>
        </DndProvider>
      </>
    )
  }
}
