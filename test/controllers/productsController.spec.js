const mocha = require("mocha");
const chai = require("chai");
// import products controller:
const productsController = require("../../api/controllers/products");
const expect = chai.expect;

// require sequelize
const sequelize = require("sequelize");

//require sinon and sinon-chai:
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

// Tell chai to use sinon-chai
chai.use(sinonChai);

describe("productsController", () => {
  describe("products_get_all", () => {
    // make cleanup simplier
    const sandbox = sinon.createSandbox();
    afterEach(function () {
      sinon.restore();
      sandbox.restore();
    });
    const req = {
      params: {
        id: 1,
      },
    };
    const statusJsonSpy = sinon.spy();

    const res = {
      // json: () => { },
      // Turn the method into a spy function.  It does nothing but chai can track it, to see if its called.
      json: sinon.spy(),
      // status: sinon.stub().returns({json: sinon.spy()}),
      status: sinon.stub().returns({ json: statusJsonSpy }),
      set: sinon.stub().returns({ json: statusJsonSpy }),
    };
    it("should return a model if found", async () => {
      // TODO: Write the unit test.

      // Arrange:
      // Mock out the findAll method:
      var data = [
        {
          dataValues: {
            name: "BS66",
            value: "66.00",
            id: 8,
            productImage:
              "http://res.cloudinary.com/dcpxcocju/image/upload/v1618802379/ictwe13cef1r6aydrz1s.png",
          },
        },
      ];

      var dataRes = {
        count: 1,
        products: [
          {
            name: "BS66",
            value: "66.00",
            _id: "8",
            productImage:
              "http://res.cloudinary.com/dcpxcocju/image/upload/v1618802379/ictwe13cef1r6aydrz1s.png",
            request: { type: "GET", url: "http://localhost:3000/products/" },
          },
        ],
      };

      //Stub the function our method will call
      sequelize.Model.findAll = sandbox.stub().returns(Promise.resolve(data));

      // Act

      // call the method:  Must call await on method call.
      await productsController.products_get_all(req, res);

      // Assert
      // Is res.json called and passed the object from the Promise.resolve above:
      // expect(res.json).to.have.been.calledWith(data);
      expect(statusJsonSpy).to.have.been.calledWith(dataRes);
      // expect(res.status).to.have.been.calledWith(200);
    });

    it("should return an error message if an error occurs", async () => {
      // TODO: Write the unit test.
      //Arrange
      sequelize.Model.findAll = sandbox.stub().returns(Promise.resolve(data));

      var data = [
        {
          dataValues: {
            name: "BS66",
            value: "66.00",
            id: 8,
            productImage:
              "http://res.cloudinary.com/dcpxcocju/image/upload/v1618802379/ictwe13cef1r6aydrz1s.png",
          },
        },
      ];

      var errorObj = { error: "error message" };
      sequelize.Model.findAll = sandbox
        .stub()
        .returns(Promise.reject("error message"));

      //Act
      await productsController.products_get_all(req, res);

      // await console.log("---");
      // Assert
      expect(res.status).to.have.been.calledWith(500);
      expect(statusJsonSpy).to.have.been.calledWith(errorObj);
    });
  });
});
