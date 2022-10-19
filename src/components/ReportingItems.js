import { Accordion, AccordionHeader, AccordionItem } from "reactstrap"

const ReportingItems = ({ items }) => {

    const toggle = () => {
      alert('ok')
    }

    return (
        <Accordion className='accordion-without-arrow' toggle={ toggle }>
          { items.map((item, index) => <AccordionItem key={`${item.index}-${item.title}`}>
            <AccordionHeader targetId={index.toString()}>{ item.title }</AccordionHeader>
          </AccordionItem>) }
        </Accordion>
    )
}

export default ReportingItems