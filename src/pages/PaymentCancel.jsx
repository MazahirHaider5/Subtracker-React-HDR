import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardText, Container, Row, Col } from "reactstrap";

const PaymentCancel = () => {
    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Row className="w-100">
                <Col md="8" lg="6" className="mx-auto">
                    <Card className="shadow-lg border-0 rounded py-5">
                        <CardBody>
                            <CardTitle tag="h5" className="text-center text-danger">
                                <i className="fas fa-times-circle"></i> Payment Canceled
                            </CardTitle>
                            <CardText className="text-center text-muted">
                                Unfortunately, your payment was not successful. Please try again or contact support for assistance.
                            </CardText>
                            <div className="text-center mt-4">
                                <Link to="/subscription-plan" className="btn btn-warning px-4 py-2 text-decoration-none rounded">
                                    Try Again
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentCancel;
