class ResponseBuilder {

  compose(data: any = {}, success: boolean = true, errors: string[] = []) {
    return {
      success,
      errors,
      data: data
    }
  }
}

export const Response = new ResponseBuilder();
