import { getQueryFromRequest } from '../../src/common/helpers/getQueryFromRequest';
import { testRequestValidData } from '../testData/data';

describe('helpers', () => {
  it('should return mapped blog object', async () => {
    const query = getQueryFromRequest.getQueryFromRequest(testRequestValidData);
    expect(query).toMatchObject({
      pageNumber: expect.any(Number),
      pageSize: expect.any(Number),
      sortBy: expect.any(String),
      sortDirection: expect.any(String),
      search: expect.any(String),
    });
    expect(query.search).toBe('name');
  });
});
