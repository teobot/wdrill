import { useState, useEffect, createContext, useContext } from "react";

import DrillContainer from "../components/DrillContainer";

import { Container, Offcanvas } from "react-bootstrap";

import data from "../data/index";
import DrillSegmentTags from "../components/DrillSegmentTags";
import DrillSegmentStars from "../components/DrillSegmentStars";

const OffCanvasContext = createContext();

export const useOffCanvas = () => {
  return useContext(OffCanvasContext);
};

export default function Home() {
  const [show, setShow] = useState(false);
  const [displayDrill, setDisplayDrill] = useState(null);

  const hideDrill = () => setDisplayDrill(null);
  const showDrill = (drill) => setDisplayDrill(drill);

  useEffect(() => {
    if (displayDrill) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [displayDrill]);

  return (
    <>
      <Offcanvas
        style={{borderRadius: "15px 15px 0px 0px"}}
        className="h-75"
        responsive="xxl"
        placement="bottom"
        show={show}
        onHide={hideDrill}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h1 className="p-0 m-0 bold">{displayDrill?.title || ""}</h1>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="w-100 mb-3">
            <DrillSegmentTags
              centered
              title={displayDrill?.title || ""}
              tags={displayDrill?.tags || []}
            />
          </div>
          <div className="w-100 mb-3 mb-3">
            <DrillSegmentStars
              centered
              size={50}
              title={displayDrill?.title || ""}
              stars={displayDrill?.stars || 0}
            />
          </div>
          <div
            className="w-100 rounded m-3"
            style={{ height: 1, backgroundColor: "lightgrey" }}
          />
          <div className="w-100 p-2">
            <p>
              {displayDrill?.instructions.split(".").map((text) => (
                <>
                  {text}
                  <br />
                  <br />
                </>
              )) || "No instructions available"}
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Container fluid>
        <OffCanvasContext.Provider value={{ hideDrill, showDrill }}>
          {data.map((category) => (
            <DrillContainer
              key={category.id}
              title={category.title}
              drills={category.drills}
            />
          ))}
        </OffCanvasContext.Provider>
      </Container>
    </>
  );
}
