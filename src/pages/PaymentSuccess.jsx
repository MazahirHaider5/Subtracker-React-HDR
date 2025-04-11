import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText, Container, Row, Col } from "reactstrap";

const PaymentSuccess = () => {
    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Row className="w-100">
                <Col md="8" lg="6" className="mx-auto">
                    <Card className="shadow-lg border-0 rounded py-5">
                        <CardBody>
                            <CardTitle tag="h5" className="text-center text-success">
                                <i className="fas fa-check-circle"></i> Payment Successful!
                            </CardTitle>
                            <CardText className="text-center text-muted">
                                Thank you for your purchase. Your payment was completed successfully.
                            </CardText>
                            <div className="text-center mt-4"> 
                                <Link to="/subscription-plan" className=" fw-500 fs-15  btn-fill-color border-1 border-white px-4 py-3 text-decoration-none rounded">
                                    Go to Subscription Plan's
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentSuccess;
