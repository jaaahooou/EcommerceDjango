import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

function Paginate({ pages, page, keyword = "", isAdmin = false }) {
  if (keyword) {
    keyword = keyword.split("?keyword=")[1].split("&")[0];
  }

  return (
    pages > 1 && (
      <div>
        {!isAdmin ? (
          <Pagination>
            {[...Array(pages).keys()].map((x) => (
              <LinkContainer
                key={x + 1}
                to={{
                  search: `?keyword=${keyword}&page=${x + 1}`,
                }}
              >
                <Pagination.Item active={x + 1 === page}>
                  {x + 1}|{page}{" "}
                </Pagination.Item>
              </LinkContainer>
            ))}
          </Pagination>
        ) : (
          <Pagination>
            {[...Array(pages).keys()].map((x) => (
              <LinkContainer
                key={x + 1}
                to={{
                  search: `/admin/productlist/?keyword=${keyword}&page=${
                    x + 1
                  }`,
                }}
              >
                <Pagination.Item active={x + 1 === page}>
                  {x + 1}{" "}
                </Pagination.Item>
              </LinkContainer>
            ))}
          </Pagination>
        )}
      </div>
    )
  );
}

export default Paginate;
