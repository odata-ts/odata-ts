import { Schema } from '../src/model'
import { expect } from 'chai';
import 'mocha';

describe('First test', () => {

    it('should return true', () => {
        const result = new Schema("rapid");

        expect(result.name).to.equal("rapid");
        expect(result.elements).to.be.empty;
    });

});